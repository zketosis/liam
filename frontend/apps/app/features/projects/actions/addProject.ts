'use server'

import { prisma } from '@liam-hq/db'

export const addProject = async (formData: FormData) => {
  const projectName = formData.get('projectName') as string
  const project = await prisma.project.create({
    data: {
      name: projectName,
    },
  })

  return project
}
