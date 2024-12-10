import type {
  AlterTableStmt,
  CommentStmt,
  Constraint,
  CreateStmt,
  IndexStmt,
  List,
  Node,
  String as PgString,
} from '@pgsql/types'
import type {
  Columns,
  DBStructure,
  ForeignKeyConstraint,
  Relationship,
  Table,
} from '../../../schema/index.js'
import {
  defaultRelationshipName,
  handleOneToOneRelationships,
} from '../../utils/index.js'
import type { RawStmtWrapper } from './parser.js'

// Transform function for AST to DBStructure
export const convertToDBStructure = (ast: RawStmtWrapper[]): DBStructure => {
  const tables: Record<string, Table> = {}
  const relationships: Record<string, Relationship> = {}

  function isStringNode(node: Node): node is { String: PgString } {
    return (
      'String' in node &&
      typeof node.String === 'object' &&
      node.String !== null &&
      'sval' in node.String &&
      node.String.sval !== 'pg_catalog'
    )
  }

  function isConstraintNode(node: Node): node is { Constraint: Constraint } {
    return (node as { Constraint: Constraint }).Constraint !== undefined
  }

  function isCreateStmt(stmt: Node): stmt is { CreateStmt: CreateStmt } {
    return 'CreateStmt' in stmt
  }

  function isIndexStmt(stmt: Node): stmt is { IndexStmt: IndexStmt } {
    return 'IndexStmt' in stmt
  }

  function isCommentStmt(stmt: Node): stmt is { CommentStmt: CommentStmt } {
    return 'CommentStmt' in stmt
  }

  function isAlterTableStmt(
    stmt: Node,
  ): stmt is { AlterTableStmt: AlterTableStmt } {
    return 'AlterTableStmt' in stmt
  }

  // ON UPDATE or ON DELETE subclauses for foreign key
  // see: https://github.com/launchql/pgsql-parser/blob/pgsql-parser%4013.16.0/packages/deparser/src/deparser.ts#L3101-L3141
  function getConstraintAction(action?: string): ForeignKeyConstraint {
    switch (action?.toLowerCase()) {
      case 'r':
        return 'RESTRICT'
      case 'c':
        return 'CASCADE'
      case 'n':
        return 'SET_NULL'
      case 'd':
        return 'SET_DEFAULT'
      case 'a':
        return 'NO_ACTION'
      default:
        return 'NO_ACTION' // Default to 'NO_ACTION' for unknown or missing values
    }
  }

  function handleCreateStmt(createStmt: CreateStmt) {
    if (!createStmt || !createStmt.relation || !createStmt.tableElts) return

    const tableName = createStmt.relation.relname
    const columns: Columns = {}
    for (const elt of createStmt.tableElts) {
      if ('ColumnDef' in elt) {
        const colDef = elt.ColumnDef
        columns[colDef.colname || ''] = {
          name: colDef.colname || '',
          type:
            colDef.typeName?.names
              ?.filter(isStringNode)
              .map((n) => n.String.sval)
              .join('') || '',
          default:
            colDef.constraints
              ?.filter(isConstraintNode)
              .reduce<string | number | boolean | null>((defaultValue, c) => {
                const constraint = c.Constraint
                if (
                  constraint.contype !== 'CONSTR_DEFAULT' ||
                  !constraint.raw_expr ||
                  !('A_Const' in constraint.raw_expr)
                )
                  return defaultValue

                const aConst = constraint.raw_expr.A_Const
                if ('sval' in aConst && 'sval' in aConst.sval)
                  return aConst.sval.sval
                if ('ival' in aConst && 'ival' in aConst.ival)
                  return aConst.ival.ival
                if ('boolval' in aConst && 'boolval' in aConst.boolval)
                  return aConst.boolval.boolval

                return defaultValue
              }, null) || null,
          check: null, // TODO
          primary:
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) => c.Constraint.contype === 'CONSTR_PRIMARY') || false,
          unique:
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) =>
                ['CONSTR_UNIQUE', 'CONSTR_PRIMARY'].includes(
                  c.Constraint.contype ?? '',
                ),
              ) || false,
          notNull:
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) => c.Constraint.contype === 'CONSTR_NOTNULL') ||
            // If primary key, it's not null
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) => c.Constraint.contype === 'CONSTR_PRIMARY') ||
            false,
          comment: null, // TODO
        }

        for (const constraint of (colDef.constraints ?? []).filter(
          isConstraintNode,
        )) {
          if (constraint.Constraint.contype !== 'CONSTR_FOREIGN') {
            continue
          }

          const foreign = constraint.Constraint
          const primaryTableName = foreign.pktable?.relname
          const primaryColumnName =
            foreign.pk_attrs?.[0] && isStringNode(foreign.pk_attrs[0])
              ? foreign.pk_attrs[0].String.sval
              : undefined

          if (!primaryTableName || !primaryColumnName) {
            throw new Error('Invalid foreign key constraint')
          }

          const foreignColumnName = colDef.colname || ''

          if (primaryTableName && tableName) {
            const relationshipName = defaultRelationshipName(
              primaryTableName,
              primaryColumnName,
              tableName,
              foreignColumnName,
            )
            const updateConstraint = getConstraintAction(foreign.fk_upd_action)
            const deleteConstraint = getConstraintAction(foreign.fk_del_action)

            relationships[relationshipName] = {
              name: relationshipName,
              primaryTableName,
              primaryColumnName,
              foreignTableName: tableName,
              foreignColumnName,
              cardinality: 'ONE_TO_MANY',
              updateConstraint,
              deleteConstraint,
            }
          }
        }
      }
    }

    if (tableName) {
      tables[tableName] = {
        name: tableName,
        columns,
        comment: null,
        indices: {},
      }
    }
  }

  function handleIndexStmt(indexStmt: IndexStmt) {
    if (
      !indexStmt ||
      !indexStmt.idxname ||
      !indexStmt.relation ||
      !indexStmt.indexParams
    )
      return

    const indexName = indexStmt.idxname
    const tableName = indexStmt.relation.relname
    const unique = indexStmt.unique !== undefined
    const columns = indexStmt.indexParams
      .map((param) => {
        if ('IndexElem' in param) {
          return param.IndexElem.name
        }
        return undefined
      })
      .filter((name): name is string => name !== undefined)

    if (tableName) {
      tables[tableName] = {
        name: tables[tableName]?.name || tableName,
        comment: tables[tableName]?.comment || null,
        columns: tables[tableName]?.columns || {},
        indices: {
          ...tables[tableName]?.indices,
          [indexName]: {
            name: indexName,
            unique: unique,
            columns,
          },
        },
      }
    }
  }

  function handleCommentStmt(commentStmt: CommentStmt) {
    if (
      commentStmt.objtype !== 'OBJECT_TABLE' &&
      commentStmt.objtype !== 'OBJECT_COLUMN'
    )
      return
    const objectNode = commentStmt.object
    if (!objectNode) return
    const isList = (stmt: Node): stmt is { List: List } => 'List' in stmt
    if (!isList(objectNode)) return

    const comment = commentStmt.comment
    if (!comment) return

    const extractStringValue = (item: Node): string | null =>
      'String' in item &&
      typeof item.String === 'object' &&
      item.String !== null &&
      'sval' in item.String
        ? item.String.sval
        : null

    const list = objectNode.List.items || []
    const last1 = list[list.length - 1]
    const last2 = list[list.length - 2]
    if (!last1) return

    switch (commentStmt.objtype) {
      case 'OBJECT_TABLE': {
        // Supports both of the following formats, but currently ignores the validity of `scope_name` values:
        // `COMMENT ON TABLE <scope_name>.<table_name> IS '<comment>';`
        // or
        // `COMMENT ON TABLE <table_name> IS '<comment>';`
        const tableName = extractStringValue(last1)
        if (!tableName) return
        if (!tables[tableName]) return
        tables[tableName].comment = comment
        return
      }
      case 'OBJECT_COLUMN': {
        // Supports both of the following formats, but currently ignores the validity of `scope_name` values:
        // `COMMENT ON COLUMN <scope_name>.<table_name>.<column_name> IS '<comment>';`
        // or
        // `COMMENT ON COLUMN <table_name>.<column_name> IS '<comment>';`
        if (!last2) return
        const tableName = extractStringValue(last2)
        if (!tableName) return
        if (!tables[tableName]) return
        const columnName = extractStringValue(last1)
        if (!columnName) return
        if (!tables[tableName].columns[columnName]) return
        tables[tableName].columns[columnName].comment = comment
        return
      }
      default:
      // NOTE: unexpected, but do nothing for now.
    }
  }

  function handleAlterTableStmt(alterTableStmt: AlterTableStmt) {
    if (!alterTableStmt || !alterTableStmt.relation || !alterTableStmt.cmds)
      return

    const foreignTableName = alterTableStmt.relation.relname
    if (!foreignTableName) return

    for (const cmd of alterTableStmt.cmds) {
      if (!('AlterTableCmd' in cmd)) continue

      const alterTableCmd = cmd.AlterTableCmd
      if (alterTableCmd.subtype === 'AT_AddConstraint') {
        const constraint = alterTableCmd.def
        if (!constraint || !isConstraintNode(constraint)) continue
        if (constraint.Constraint.contype === 'CONSTR_FOREIGN') {
          const foreign = constraint.Constraint
          const primaryTableName = foreign.pktable?.relname
          const primaryColumnName =
            foreign.pk_attrs?.[0] && isStringNode(foreign.pk_attrs[0])
              ? foreign.pk_attrs[0].String.sval
              : undefined

          const foreignColumnName =
            foreign.fk_attrs?.[0] && isStringNode(foreign.fk_attrs[0])
              ? foreign.fk_attrs[0].String.sval
              : undefined

          if (!primaryTableName || !primaryColumnName || !foreignColumnName) {
            throw new Error('Invalid foreign key constraint')
          }

          if (primaryTableName && foreignColumnName) {
            const relationshipName = foreign.conname
            const updateConstraint = getConstraintAction(foreign.fk_upd_action)
            const deleteConstraint = getConstraintAction(foreign.fk_del_action)

            if (!relationshipName) {
              throw new Error('Invalid foreign key constraint')
            }

            relationships[relationshipName] = {
              name: relationshipName,
              primaryTableName,
              primaryColumnName,
              foreignTableName,
              foreignColumnName,
              cardinality: 'ONE_TO_MANY',
              updateConstraint,
              deleteConstraint,
            }
          }
        }
      }
    }
  }

  if (!ast) {
    return {
      tables: {},
      relationships: {},
    }
  }

  // pg-query-emscripten does not have types, so we need to define them ourselves
  // @ts-expect-error
  for (const statement of ast.parse_tree.stmts) {
    if (statement?.stmt === undefined) continue

    const stmt = statement.stmt
    if (isCreateStmt(stmt)) {
      handleCreateStmt(stmt.CreateStmt)
    } else if (isIndexStmt(stmt)) {
      handleIndexStmt(stmt.IndexStmt)
    } else if (isCommentStmt(stmt)) {
      handleCommentStmt(stmt.CommentStmt)
    } else if (isAlterTableStmt(stmt)) {
      handleAlterTableStmt(stmt.AlterTableStmt)
    }
  }

  handleOneToOneRelationships(tables, relationships)

  return {
    tables,
    relationships,
  }
}
