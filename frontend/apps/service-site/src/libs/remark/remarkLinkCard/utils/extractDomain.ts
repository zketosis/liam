export const extractDomain = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname

    return domain
  } catch {
    return null
  }
}
