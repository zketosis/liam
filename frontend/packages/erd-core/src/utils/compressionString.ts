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

export async function compressToUTF16(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const inputBytes = encoder.encode(input)

  // Deflate compression
  const compressionStream = new CompressionStream('deflate')
  const compressedStream =
    createReadableStreamFromBytes(inputBytes).pipeThrough(compressionStream)
  const compressedBuffer = await new Response(compressedStream).arrayBuffer()
  const compressedBytes = new Uint8Array(compressedBuffer)

  // Store the length of the compressed bytes in the first 4 bytes
  const length = compressedBytes.length
  const totalLength = 4 + length // Store length in the first 4 bytes
  // Align to 2-byte (UTF-16 code unit) boundary, add 1 byte padding if necessary
  const paddedLength = totalLength % 2 === 0 ? totalLength : totalLength + 1

  const resultBytes = new Uint8Array(paddedLength)
  const dataView = new DataView(resultBytes.buffer)

  // Store length information in the first 4 bytes (Little Endian)
  dataView.setUint32(0, length, true)
  // Store the compressed data after the first 4 bytes
  resultBytes.set(compressedBytes, 4)

  // Convert to Uint16Array to interpret as UTF-16 code units
  const uint16Array = new Uint16Array(resultBytes.buffer)

  // Convert each Uint16 element to a character
  return String.fromCharCode(...Array.from(uint16Array))
}

export async function decompressFromUTF16(input: string): Promise<string> {
  const decoder = new TextDecoder()

  // Reconstruct Uint16Array from UTF-16 code units
  const codeUnits = new Uint16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    codeUnits[i] = input.charCodeAt(i)
  }

  // Reference Uint8Array from Uint16Array
  const bytes = new Uint8Array(codeUnits.buffer)
  const dataView = new DataView(bytes.buffer)

  // Get the actual length of the compressed data from the first 4 bytes
  const length = dataView.getUint32(0, true)

  // Extract the compressed data part
  const compressedBytes = bytes.subarray(4, 4 + length)

  // Decompress
  const decompressionStream = new DecompressionStream('deflate')
  const decompressedStream =
    createReadableStreamFromBytes(compressedBytes).pipeThrough(
      decompressionStream,
    )
  const decompressedBuffer = await new Response(
    decompressedStream,
  ).arrayBuffer()

  return decoder.decode(decompressedBuffer)
}
