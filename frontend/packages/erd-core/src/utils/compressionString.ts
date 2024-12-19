function createReadableStreamFromBytes(
  bytes: Uint8Array,
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  })
}

/**
 * Perform Deflate compression and return a Uint8Array
 */
async function deflateCompress(inputBytes: Uint8Array): Promise<Uint8Array> {
  const compression = new CompressionStream('deflate')
  const stream =
    createReadableStreamFromBytes(inputBytes).pipeThrough(compression)
  const compressedBuffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(compressedBuffer)
}

/**
 * Perform Deflate decompression and return a Uint8Array
 */
async function deflateDecompress(inputBytes: Uint8Array): Promise<Uint8Array> {
  const decompression = new DecompressionStream('deflate')
  const stream =
    createReadableStreamFromBytes(inputBytes).pipeThrough(decompression)
  const decompressedBuffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(decompressedBuffer)
}

/**
 * Encode byte array to Base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binaryString = ''
  for (const b of Array.from(bytes)) {
    binaryString += String.fromCharCode(b)
  }
  return btoa(binaryString)
}

/**
 * Decode Base64 string to byte array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const length = binaryString.length
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Convert Base64 string to URL-safe string (`+` => `-`, `/` => `_`, remove `=`)
 */
function base64ToUrlSafe(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Convert URL-safe string back to Base64
 */
function urlSafeToBase64(urlSafe: string): string {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return base64
}

/**
 * Compress string using Deflate and return as Base64
 */
async function compressToBase64(input: string): Promise<string> {
  const textEncoder = new TextEncoder()
  const inputBytes = textEncoder.encode(input)
  const compressedBytes = await deflateCompress(inputBytes)
  return bytesToBase64(compressedBytes)
}

/**
 * Decompress Base64 string and return the original string
 */
async function decompressFromBase64(input: string): Promise<string> {
  const textDecoder = new TextDecoder()
  const compressedBytes = base64ToBytes(input)
  const decompressedBytes = await deflateDecompress(compressedBytes)
  return textDecoder.decode(decompressedBytes)
}

/**
 * Compress string using Deflate and return as URL-safe encoded string (based on Base64)
 */
export async function compressToEncodedURIComponent(
  input: string,
): Promise<string> {
  const base64 = await compressToBase64(input)
  return base64ToUrlSafe(base64)
}

/**
 * Restore original string from URL-safe encoded string
 */
export async function decompressFromEncodedURIComponent(
  input: string,
): Promise<string> {
  const base64 = urlSafeToBase64(input)
  return decompressFromBase64(base64)
}
