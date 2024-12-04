import {
  ArrayNode,
  AssocNode,
  CallNode,
  FalseNode,
  IntegerNode,
  KeywordHashNode,
  LocalVariableReadNode,
  type Node,
  StatementsNode,
  StringNode,
  SymbolNode,
  TrueNode,
  Visitor,
  loadPrism,
} from '@ruby/prism'
import type {
  Column,
  Columns,
  DBStructure,
  Index,
  Indices,
  Table,
  Tables,
} from '../../schema/index.js'
import { aColumn, aTable, anIndex } from '../../schema/index.js'
import type { Processor } from '../types.js'

function extractTableName(argNodes: Node[]): string {
  const nameNode = argNodes.find((node) => node instanceof StringNode)
  if (!nameNode) {
    throw new Error('Table name not found')
  }
  // @ts-expect-error: unescaped is defined as string but it is actually object
  return nameNode.unescaped.value
}

function extractIdColumn(argNodes: Node[]): Column | null {
  const idKeywordHash = argNodes.find((node) => node instanceof KeywordHashNode)

  const idColumn = aColumn({
    name: 'id',
    type: '',
    notNull: true,
    primary: true,
    unique: true,
  })

  if (idKeywordHash) {
    const idAssoc = idKeywordHash.elements.find(
      (elem) =>
        elem instanceof AssocNode &&
        elem.key instanceof SymbolNode &&
        // @ts-expect-error: unescaped is defined as string but it is actually object
        elem.key.unescaped.value === 'id',
    )

    if (idAssoc && idAssoc instanceof AssocNode) {
      // @ts-expect-error: unescaped is defined as string but it is actually object
      idColumn.type = idAssoc.value.unescaped.value
      return idColumn
    }
  }

  // Since 5.1 PostgreSQL adapter uses bigserial type for primary key in default
  // See:https://github.com/rails/rails/blob/v8.0.0/activerecord/lib/active_record/migration/compatibility.rb#L377
  idColumn.type = 'bigserial'
  return idColumn
}

function extractTableDetails(blockNodes: Node[]): [Column[], Index[]] {
  const columns: Column[] = []
  const indices: Index[] = []

  for (const blockNode of blockNodes) {
    if (blockNode instanceof StatementsNode) {
      for (const node of blockNode.compactChildNodes()) {
        if (
          node instanceof CallNode &&
          node.receiver instanceof LocalVariableReadNode &&
          node.receiver.name === 't'
        ) {
          if (node.name === 'index') {
            const index = extractIndexDetails(node)
            indices.push(index)
            continue
          }

          const column = extractColumnDetails(node)
          if (column.name) columns.push(column)
        }
      }
    }
  }

  return [columns, indices]
}

function extractColumnDetails(node: CallNode): Column {
  const column = aColumn({
    name: '',
    type: node.name,
  })

  const argNodes = node.arguments_?.compactChildNodes() || []
  for (const argNode of argNodes) {
    if (argNode instanceof StringNode) {
      // @ts-expect-error: unescaped is defined as string but it is actually object
      column.name = argNode.unescaped.value
    } else if (argNode instanceof KeywordHashNode) {
      extractColumnOptions(argNode, column)
    }
  }

  return column
}

function extractIndexDetails(node: CallNode): Index {
  const index = anIndex({
    name: '',
    unique: false,
    columns: [],
  })

  const argNodes = node.arguments_?.compactChildNodes() || []
  for (const argNode of argNodes) {
    if (argNode instanceof ArrayNode) {
      const argElemens = argNode.compactChildNodes()
      for (const argElem of argElemens) {
        if (argElem instanceof StringNode) {
          // @ts-expect-error: unescaped is defined as string but it is actually object
          index.columns.push(argElem.unescaped.value)
        }
      }
    } else if (argNode instanceof KeywordHashNode) {
      extractIndexOptions(argNode, index)
    }
  }

  return index
}

function extractColumnOptions(hashNode: KeywordHashNode, column: Column): void {
  for (const argElement of hashNode.elements) {
    if (!(argElement instanceof AssocNode)) continue
    // @ts-expect-error: unescaped is defined as string but it is actually object
    const key = argElement.key.unescaped.value
    const value = argElement.value

    switch (key) {
      case 'null':
        column.notNull = value instanceof FalseNode
        break
      case 'default':
        column.default = extractDefaultValue(value)
        break
      case 'unique':
        column.unique = value instanceof TrueNode
        break
    }
  }
}

function extractIndexOptions(hashNode: KeywordHashNode, index: Index): void {
  for (const argElement of hashNode.elements) {
    if (!(argElement instanceof AssocNode)) continue
    // @ts-expect-error: unescaped is defined as string but it is actually object
    const key = argElement.key.unescaped.value
    const value = argElement.value

    switch (key) {
      case 'name':
        // @ts-expect-error: unescaped is defined as string but it is actually object
        index.name = value.unescaped.value
        break
      case 'unique':
        index.unique = value instanceof TrueNode
        break
    }
  }
}

function extractDefaultValue(
  value: TrueNode | FalseNode | StringNode | IntegerNode,
): string | number | boolean | null {
  if (value instanceof TrueNode) return true
  if (value instanceof FalseNode) return false
  // @ts-expect-error: unescaped is defined as string but it is actually object
  if (value instanceof StringNode) return value.unescaped.value
  // @ts-expect-error: IntegerNode actually has value property
  if (value instanceof IntegerNode) return value.value
  return null
}

class DBStructureFinder extends Visitor {
  private tables: Table[] = []

  getDBStructure(): DBStructure {
    const dbStructure: DBStructure = {
      tables: this.tables.reduce((acc, table) => {
        acc[table.name] = table
        return acc
      }, {} as Tables),
      relationships: {},
    }
    return dbStructure
  }

  override visitCallNode(node: CallNode): void {
    if (node.name === 'create_table') {
      const argNodes = node.arguments_?.compactChildNodes() || []

      const table = aTable({
        name: extractTableName(argNodes),
      })

      const columns: Column[] = []
      const indices: Index[] = []

      const idColumn = extractIdColumn(argNodes)
      if (idColumn) columns.push(idColumn)

      const blockNodes = node.block?.compactChildNodes() || []
      const [extractColumns, extractIndices] = extractTableDetails(blockNodes)

      columns.push(...extractColumns)
      indices.push(...extractIndices)

      table.columns = columns.reduce((acc, column) => {
        acc[column.name] = column
        return acc
      }, {} as Columns)

      table.indices = indices.reduce((acc, index) => {
        acc[index.name] = index
        return acc
      }, {} as Indices)

      this.tables.push(table)
    }

    super.visitCallNode(node)
  }
}

async function parseRubySchema(schemaString: string): Promise<DBStructure> {
  const parse = await loadPrism()
  const tableFinder = new DBStructureFinder()

  const parseResult = parse(schemaString)
  parseResult.value.accept(tableFinder)

  return tableFinder.getDBStructure()
}

export const processor: Processor = (str) => parseRubySchema(str)
