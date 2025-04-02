'use server'

import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { createOrUpdateFileContent } from '@liam-hq/github'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

// Define schema for form data validation with transforms
const formDataSchema = v.object({
  suggestionId: v.pipe(
    v.string(),
    v.transform((value) => Number(value)),
  ),
  repositoryOwner: v.string(),
  repositoryName: v.string(),
  installationId: v.pipe(
    v.string(),
    v.transform((value) => Number(value)),
  ),
})

export const approveKnowledgeSuggestion = async (formData: FormData) => {
  // Parse and validate form data
  const formDataObject = {
    suggestionId: formData.get('suggestionId'),
    repositoryOwner: formData.get('repositoryOwner'),
    repositoryName: formData.get('repositoryName'),
    installationId: formData.get('installationId'),
  }

  const parsedData = v.safeParse(formDataSchema, formDataObject)

  if (!parsedData.success) {
    throw new Error(`Invalid form data: ${JSON.stringify(parsedData.issues)}`)
  }

  const { suggestionId, repositoryOwner, repositoryName, installationId } =
    parsedData.output

  try {
    const supabase = await createClient()

    // Get the knowledge suggestion
    const { data: suggestion, error: findError } = await supabase
      .from('KnowledgeSuggestion')
      .select('*')
      .eq('id', suggestionId)
      .single()

    if (findError || !suggestion) {
      throw new Error('Knowledge suggestion not found')
    }

    // Update the file on GitHub
    const repositoryFullName = `${repositoryOwner}/${repositoryName}`
    const result = await createOrUpdateFileContent(
      repositoryFullName,
      suggestion.path,
      suggestion.content,
      suggestion.title, // Use title as commit message
      installationId,
      suggestion.branchName,
      suggestion.fileSha || undefined,
    )

    if (!result.success) {
      throw new Error('Failed to update file on GitHub')
    }

    // Update the knowledge suggestion with approvedAt
    const { error: updateError } = await supabase
      .from('KnowledgeSuggestion')
      .update({ approvedAt: new Date().toISOString() })
      .eq('id', suggestionId)

    if (updateError) {
      throw new Error('Failed to update knowledge suggestion')
    }

    // Redirect back to the knowledge suggestion detail page
    redirect(
      urlgen(
        'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions/[id]',
        {
          projectId: `${suggestion.projectId}`,
          branchOrCommit: suggestion.branchName,
          id: `${suggestionId}`,
        },
      ),
    )
  } catch (error) {
    console.error('Error approving knowledge suggestion:', error)
    throw error
  }
}
