import type {
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
  Relationship,
  Relationships,
  Table,
  Tables,
} from '../../../schema/index.js'
import type { RawStmtWrapper } from './parser.js'

// If there is a unique index for a column in relationships, make it `ONE_TO_ONE` cardinality.
const handleOneToOneRelationships = (
  tables: Tables,
  relationships: Relationships,
) => {
  for (const relationship of Object.values(relationships)) {
    const foreignTable = tables[relationship.foreignTableName]
    const foreignColumn = foreignTable?.columns[relationship.foreignColumnName]

    if (foreignColumn?.unique) {
      relationship.cardinality = 'ONE_TO_ONE'
    }
  }
}

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
              .some((c) => c.Constraint.contype === 'CONSTR_UNIQUE') || false,
          notNull:
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) => c.Constraint.contype === 'CONSTR_NOTNULL') ||
            // If primary key, it's not null
            colDef.constraints
              ?.filter(isConstraintNode)
              .some((c) => c.Constraint.contype === 'CONSTR_PRIMARY') ||
            false,
          increment:
            colDef.typeName?.names
              ?.filter(isStringNode)
              .some((n) => n.String.sval === 'serial') || false,
          comment: null, // TODO
        }

        // Handle REFERENCES constraints for relationships

        // Update or delete constraint for foreign key
        // see: https://github.com/launchql/pgsql-parser/blob/pgsql-parser%4013.16.0/packages/deparser/src/deparser.ts#L3101-L3141
        const getConstraintAction = (action?: string): string => {
          switch (action?.toLowerCase()) {
            case 'r':
              return 'RESTRICT'
            case 'c':
              return 'CASCADE'
            case 'n':
              return 'SET NULL'
            case 'd':
              return 'SET DEFAULT'
            case 'a':
              return 'NO ACTION'
            default:
              return 'NO ACTION' // Default to 'NO ACTION' for unknown or missing values
          }
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
            // relationshipName example: "users_id_to_posts_user_id"
            const relationshipName = `${primaryTableName}_${primaryColumnName}_to_${tableName}_${foreignColumnName}`
            const updateConstraint = getConstraintAction(foreign.fk_upd_action)
            const deleteConstraint = getConstraintAction(foreign.fk_del_action)

            relationships[relationshipName] = {
              name: relationshipName,
              primaryTableName,
              primaryColumnName,
              foreignTableName: tableName,
              foreignColumnName,
              cardinality: 'ONE_TO_MANY', // TODO: Consider implementing other cardinalities
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
        comment: null, // TODO
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
    if (commentStmt.objtype !== 'OBJECT_TABLE') return
    const objectNode = commentStmt.object
    if (!objectNode) return

    const isList = (stmt: Node): stmt is { List: List } => 'List' in stmt
    if (!isList(objectNode)) return

    // Handles statements like `COMMENT ON TABLE <table_name> IS '<comment>';`.
    // NOTE: PostgreSQL allows only one comment to be added to one table per statement,
    // so we can reasonably assume the number of `<table_name>` elements is 1.
    const item = objectNode.List?.items?.[0]
    if (!item) return
    const tableName =
      'String' in item &&
      typeof item.String === 'object' &&
      item.String !== null &&
      'sval' in item.String &&
      item.String.sval

    if (!tableName) return
    if (!tables[tableName]) return
    const comment = commentStmt.comment
    if (!comment) return

    tables[tableName] = {
      ...tables[tableName],
      comment,
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
    }
  }

  handleOneToOneRelationships(tables, relationships)

  return {
    tables,
    relationships,
  }
}
