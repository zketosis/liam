import { preview } from 'vite'

export const previewCommand = async (
  publicDir: string,
  root: string,
  outDir: string,
) => {
  const previewServer = await preview({
    publicDir,
    root,
    build: {
      outDir,
      emptyOutDir: false,
    },
  })
  const address = previewServer.httpServer?.address()
  const port = typeof address === 'object' && address ? address.port : 4173
  console.info(`Preview server is running at http://localhost:${port}`)
}
