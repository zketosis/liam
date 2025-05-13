import { mastra } from '@/lib/mastra'
import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

// Define types for schema data
export interface ColumnData {
  type?: string
  nullable?: boolean
  description?: string
}

export interface TableData {
  description?: string
  columns?: Record<string, ColumnData>
  primaryKey?: {
    columns?: string[]
  }
}

export interface RelationshipData {
  fromTable: string
  fromColumn: string
  toTable: string
  toColumn: string
  type?: string
}

export interface TableGroupData {
  name?: string
  tables?: string[]
  comment?: string | null
}

export interface SchemaData {
  tables?: Record<string, TableData>
  relationships?: Record<string, RelationshipData>
  tableGroups?: Record<string, TableGroupData>
}

// Convert table data to text document
const tableToDocument = (tableName: string, tableData: TableData): string => {
  // Table description
  const tableDescription = `Table: ${tableName}\nDescription: ${tableData.description || 'No description'}\n`

  // Columns information
  let columnsText = 'Columns:\n'
  if (tableData.columns) {
    for (const [columnName, columnData] of Object.entries(tableData.columns)) {
      columnsText += `- ${columnName}: ${columnData.type || 'unknown type'} ${columnData.nullable ? '(nullable)' : '(not nullable)'}\n`
      if (columnData.description) {
        columnsText += `  Description: ${columnData.description}\n`
      }
    }
  }

  // Primary key information
  let primaryKeyText = ''
  if (tableData.primaryKey?.columns) {
    primaryKeyText = `Primary Key: ${tableData.primaryKey.columns.join(', ')}\n`
  }

  // Combine all information
  return `${tableDescription}${columnsText}${primaryKeyText}`
}

// Convert relationship data to text document
const relationshipToDocument = (
  relationshipName: string,
  relationshipData: RelationshipData,
): string => {
  return `Relationship: ${relationshipName}
From Table: ${relationshipData.fromTable}
From Column: ${relationshipData.fromColumn}
To Table: ${relationshipData.toTable}
To Column: ${relationshipData.toColumn}
Type: ${relationshipData.type || 'unknown'}\n`
}

// Convert table groups to text document
const tableGroupsToText = (
  tableGroups: Record<string, TableGroupData> | undefined,
): string => {
  if (!tableGroups) return ''

  let tableGroupsText = ''

  for (const [groupId, groupData] of Object.entries(tableGroups)) {
    tableGroupsText += `Group ID: ${groupId}\n`

    if (groupData.name) {
      tableGroupsText += `Name: ${String(groupData.name)}\n`
    }

    if (groupData.tables && Array.isArray(groupData.tables)) {
      tableGroupsText += `Tables: ${groupData.tables.join(', ')}\n`
    }

    tableGroupsText += '\n'
  }

  return tableGroupsText
}

// Convert schema data to text format
const convertSchemaToText = (schema: SchemaData): string => {
  let schemaText = 'FULL DATABASE SCHEMA:\n\n'

  // Process tables
  if (schema.tables) {
    schemaText += 'TABLES:\n\n'
    for (const [tableName, tableData] of Object.entries(schema.tables)) {
      const tableDoc = tableToDocument(tableName, tableData)
      schemaText = `${schemaText}${tableDoc}\n\n`
    }
  }

  // Process relationships
  if (schema.relationships) {
    schemaText += 'RELATIONSHIPS:\n\n'
    for (const [relationshipName, relationshipData] of Object.entries(
      schema.relationships,
    )) {
      const relationshipDoc = relationshipToDocument(
        relationshipName,
        relationshipData,
      )
      schemaText = `${schemaText}${relationshipDoc}\n\n`
    }
  }

  // Process table groups
  if (schema.tableGroups && Object.keys(schema.tableGroups).length > 0) {
    schemaText += 'TABLE GROUPS:\n\n'
    const tableGroupsText = tableGroupsToText(schema.tableGroups)
    schemaText = `${schemaText}${tableGroupsText}\n`
  }

  return schemaText
}

export async function POST(request: Request) {
  const { message, schemaData, history } = await request.json()

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  if (!schemaData || typeof schemaData !== 'object') {
    return NextResponse.json(
      { error: 'Valid schema data is required' },
      { status: 400 },
    )
  }

  // Format chat history for prompt
  const formattedChatHistory =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    history && history.length > 0
      ? history
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .map((msg: [string, string]) => `${msg[0]}: ${msg[1]}`)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .join('\n')
      : 'No previous conversation.'

  // Convert schema to text
  const schemaText = convertSchemaToText(schemaData)

  try {
    // Get the agent from Mastra
    const agent = mastra.getAgent('databaseSchemaAgent')
    if (!agent) {
      throw new Error('databaseSchemaAgent not found in Mastra instance')
    }

    // Create a response using the agent
    const response = await agent.generate([
      {
        role: 'system',
        content: `
Complete Schema Information:
${schemaText}

Previous conversation:
${formattedChatHistory}
`,
      },
      {
        role: 'user',
        content: message,
      },
    ])

    return new Response(response.text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 },
    )
  }
}
