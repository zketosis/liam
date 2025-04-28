import { langfuseHandler } from '@/lib/langfuse/langfuseHandler'
import {} from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { Document } from 'langchain/document'
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
const tableToDocument = (tableName: string, tableData: TableData): Document => {
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
  const tableText = `${tableDescription}${columnsText}${primaryKeyText}`

  return new Document({
    pageContent: tableText,
    metadata: { tableName },
  })
}

// Convert relationship data to text document
const relationshipToDocument = (
  relationshipName: string,
  relationshipData: RelationshipData,
): Document => {
  const relationshipText = `Relationship: ${relationshipName}
From Table: ${relationshipData.fromTable}
From Column: ${relationshipData.fromColumn}
To Table: ${relationshipData.toTable}
To Column: ${relationshipData.toColumn}
Type: ${relationshipData.type || 'unknown'}\n`

  return new Document({
    pageContent: relationshipText,
    metadata: { relationshipName },
  })
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
      schemaText = `${schemaText}${tableDoc.pageContent}\n\n`
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
      schemaText = `${schemaText}${relationshipDoc.pageContent}\n\n`
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

// Create chat chain with full schema context
const createChatChain = async (schemaText: string) => {
  const model = new ChatOpenAI({
    modelName: 'o4-mini-2025-04-16',
    callbacks: [langfuseHandler],
  })

  // Create a prompt template with full schema context and chat history
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a database schema expert.
Answer questions about the user's schema and provide advice on database design.
Follow these guidelines:

1. Clearly explain the structure of the schema, tables, and relationships.
2. Provide advice based on good database design principles.
3. Share best practices for normalization, indexing, and performance.
4. When using technical terms, include brief explanations.
5. Provide only information directly related to the question, avoiding unnecessary details.
6. Format your responses using markdown for better readability. Use headings, lists, code blocks, and other markdown features as appropriate.

Your goal is to help users understand and optimize their database schemas.

Complete Schema Information:
${schemaText}

Previous conversation:
{chat_history}

Question: {input}

Based on the schema information provided and considering any previous conversation, answer the question thoroughly and accurately.
`)

  return prompt.pipe(model)
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

  // Format chat history for prompt template
  const formattedChatHistory =
    history && history.length > 0
      ? history
          .map((msg: [string, string]) => `${msg[0]}: ${msg[1]}`)
          .join('\n')
      : 'No previous conversation.'

  // Convert schema to text and create chain
  const schemaText = convertSchemaToText(schemaData)
  const chain = await createChatChain(schemaText)

  // Generate response with Langfuse tracing
  const response = await chain.invoke(
    {
      input: message,
      chat_history: formattedChatHistory,
    },
    {
      callbacks: [langfuseHandler],
      // Add metadata for better tracing
      metadata: {
        endpoint: '/api/chat',
        method: 'POST',
        messageLength: message.length,
        hasHistory: history ? history.length > 0 : false,
      },
    },
  )

  return NextResponse.json({
    response: {
      text: response.content,
    },
  })
}
