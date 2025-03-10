import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
export { createServerClient } from '@supabase/ssr'
