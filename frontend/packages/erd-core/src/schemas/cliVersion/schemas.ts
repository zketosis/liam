import * as v from 'valibot'

export const cliVersionSchema = v.object({
  version: v.string(),
  gitHash: v.string(),
  isReleasedGitHash: v.boolean(),
  date: v.string(),
})
