import * as v from 'valibot'

const webVersionSchema = v.object({
  gitHash: v.string(),
  date: v.string(),
  displayedOn: v.literal('web'),
})

const innerCliVersionSchema = v.object({
  version: v.string(),
  gitHash: v.string(),
  envName: v.string(),
  isReleasedGitHash: v.boolean(),
  date: v.string(),
  displayedOn: v.literal('cli'),
})

export const cliVersionSchema = v.union([
  webVersionSchema,
  innerCliVersionSchema,
])
