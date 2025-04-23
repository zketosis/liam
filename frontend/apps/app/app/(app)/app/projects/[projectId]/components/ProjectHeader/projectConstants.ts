import {
  BookMarked,
  BookText,
  ClipboardList,
  ErdIcon,
  GitPullRequestArrow,
  Settings,
} from '@liam-hq/ui'
import { type InferOutput, literal, union } from 'valibot'

export const PROJECT_TAB = {
  PROJECT: 'project',
  SCHEMA: 'schema',
  MIGRATIONS: 'migrations',
  DOCS: 'docs',
  RULE: 'rule',
  SETTINGS: 'settings',
} as const

export const ProjectTabSchema = union([
  literal(PROJECT_TAB.PROJECT),
  literal(PROJECT_TAB.SCHEMA),
  literal(PROJECT_TAB.MIGRATIONS),
  literal(PROJECT_TAB.DOCS),
  literal(PROJECT_TAB.RULE),
  literal(PROJECT_TAB.SETTINGS),
])

export type ProjectTabValue = InferOutput<typeof ProjectTabSchema>

export interface ProjectTab {
  value: ProjectTabValue
  label: string
  icon: typeof BookMarked | typeof ErdIcon
}

export const PROJECT_TABS: ProjectTab[] = [
  { value: PROJECT_TAB.PROJECT, label: 'Project', icon: BookMarked },
  { value: PROJECT_TAB.SCHEMA, label: 'Schema', icon: ErdIcon },
  {
    value: PROJECT_TAB.MIGRATIONS,
    label: 'Migrations',
    icon: GitPullRequestArrow,
  },
  { value: PROJECT_TAB.DOCS, label: 'Docs', icon: BookText },
  { value: PROJECT_TAB.RULE, label: 'Rule', icon: ClipboardList },
  { value: PROJECT_TAB.SETTINGS, label: 'Settings', icon: Settings },
]
