import { createServer } from 'vite'
import { runPreprocess } from '../runPreprocess.js'

export const devCommand = async (
  inputPath: string,
  publicDir: string,
  root: string,
) => {
  runPreprocess(inputPath, publicDir)
  const server = await createServer({ publicDir, root })
  const address = server.httpServer?.address()
  const port = typeof address === 'object' && address ? address.port : 5173
  console.info(`Dev server is running at http://localhost:${port}`)
  await server.listen()
}
