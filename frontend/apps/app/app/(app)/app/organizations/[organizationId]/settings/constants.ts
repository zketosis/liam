import { BookMarked, GitPullRequestArrow, LayoutGrid, Users } from '@liam-hq/ui'

export const SETTINGS_TAB = {
  GENERAL: 'general',
  MEMBERS: 'members',
  BILLING: 'billing',
  PROJECTS: 'projects',
} as const

export type SettingsTabValue = (typeof SETTINGS_TAB)[keyof typeof SETTINGS_TAB]

export interface SettingsTab {
  value: SettingsTabValue
  label: string
  icon: typeof BookMarked
}

export const SETTINGS_TABS: SettingsTab[] = [
  { value: SETTINGS_TAB.GENERAL, label: 'General', icon: BookMarked },
  { value: SETTINGS_TAB.MEMBERS, label: 'Members', icon: Users },
  { value: SETTINGS_TAB.BILLING, label: 'Billing', icon: GitPullRequestArrow },
  { value: SETTINGS_TAB.PROJECTS, label: 'Projects', icon: LayoutGrid },
]
