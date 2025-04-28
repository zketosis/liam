import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import * as Sentry from '@sentry/nextjs'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { Document } from 'langchain/document'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
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

export interface SchemaData {
  tables?: Record<string, TableData>
  relationships?: Record<string, RelationshipData>
  tableGroups?: Record<string, unknown>
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

// Convert schema data to text chunks for vector storage
const convertSchemaToTexts = (schema: SchemaData): Document[] => {
  const documents: Document[] = []

  // Process tables
  if (schema.tables) {
    for (const [tableName, tableData] of Object.entries(schema.tables)) {
      documents.push(tableToDocument(tableName, tableData))
    }
  }

  // Process relationships
  if (schema.relationships) {
    for (const [relationshipName, relationshipData] of Object.entries(
      schema.relationships,
    )) {
      documents.push(relationshipToDocument(relationshipName, relationshipData))
    }
  }

  return documents
}

// Create vector store from schema data
const createVectorStore = async (schemaData: SchemaData) => {
  const documents = convertSchemaToTexts(schemaData)
  return await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings(),
  )
}

// Create chat chain
const createChatChain = async (vectorStore: MemoryVectorStore) => {
  const model = new ChatOpenAI({
    modelName: 'o4-mini-2025-04-16',
  })

  // Create a prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a database schema expert.
Answer questions about the user's schema and provide advice on database design.
Follow these guidelines:

1. Clearly explain the structure of the schema, tables, and relationships.
2. Provide advice based on good database design principles.
3. Share best practices for normalization, indexing, and performance.
4. When using technical terms, include brief explanations.
5. Provide only information directly related to the question, avoiding unnecessary details.

Your goal is to help users understand and optimize their database schemas.

Context information:
{context}

Question: {input}

Based on the context information, provide a helpful answer to the question.
`)

  // Create a document chain
  const documentChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  })

  // Create the retrieval chain
  return createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain: documentChain,
  })
}

export async function POST(request: Request) {
  try {
    const { message, schemaData, history } = await request.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      )
    }

    if (!schemaData || typeof schemaData !== 'object') {
      return NextResponse.json(
        { error: 'Valid schema data is required' },
        { status: 400 },
      )
    }

    // Create vector store and chain
    const vectorStore = await createVectorStore(schemaData)
    const chain = await createChatChain(vectorStore)

    // Format chat history
    const formattedHistory = history
      ? history.map((msg: [string, string]) =>
          msg[0] === 'Human' ? new HumanMessage(msg[1]) : new AIMessage(msg[1]),
        )
      : []

    // Generate response
    const response = await chain.invoke({
      input: message,
      chat_history: formattedHistory,
    })

    return NextResponse.json({
      response: {
        text: response.answer,
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    )
  }
}
