import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { supabaseClient } from '.'

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
})

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: 'documents',
  queryName: 'match_documents',
})

export type VectorizationResult = {
  documentId?: string
  chunkCount: number
}

export async function vectorizeUrl(url: string): Promise<VectorizationResult> {
  const loader = new CheerioWebBaseLoader(url)
  const docs = await loader.load()

  const transformer = new HtmlToTextTransformer()
  const sequence =
    RecursiveCharacterTextSplitter.fromLanguage('html').pipe(transformer)
  const newDocuments = await sequence.invoke(docs)
  const pages = newDocuments.map((doc) => doc.pageContent)

  const extractedText = await Promise.all(
    pages.map(async (page) => {
      return page.split('\n').join(' ')
    }),
  )

  const extractedDocs = extractedText.map((text) => ({
    pageContent: text,
    metadata: {},
  }))

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 0,
  })

  const chunks = await splitter.splitDocuments(extractedDocs)

  for (const chunk of chunks) {
    chunk.metadata = {
      ...chunk.metadata,
      source: url,
      type: 'webpage',
    }
  }

  const ids = await vectorStore.addDocuments(chunks)

  return {
    documentId: ids[0],
    chunkCount: chunks.length,
  }
}
