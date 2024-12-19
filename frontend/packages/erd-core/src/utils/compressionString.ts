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

  // Deflate圧縮
  const compressionStream = new CompressionStream('deflate')
  const compressedStream =
    createReadableStreamFromBytes(inputBytes).pipeThrough(compressionStream)
  const compressedBuffer = await new Response(compressedStream).arrayBuffer()
  const compressedBytes = new Uint8Array(compressedBuffer)

  // 圧縮後のバイト長を格納するため、先頭4バイトに長さ情報を入れる
  const length = compressedBytes.length
  const totalLength = 4 + length // 最初の4バイトで長さを格納
  // 2バイト(UTF-16コードユニット)境界に揃えるため、必要なら1バイトパディング
  const paddedLength = totalLength % 2 === 0 ? totalLength : totalLength + 1

  const resultBytes = new Uint8Array(paddedLength)
  const dataView = new DataView(resultBytes.buffer)

  // 先頭4バイトに長さ情報を格納 (Little Endian)
  dataView.setUint32(0, length, true)
  // その後に圧縮データ本体を格納
  resultBytes.set(compressedBytes, 4)

  // UTF-16コードユニットとして解釈するためにUint16Arrayに変換
  const uint16Array = new Uint16Array(resultBytes.buffer)

  // 各Uint16要素をコードユニットとして文字列化
  return String.fromCharCode(...Array.from(uint16Array))
}

export async function decompressFromUTF16(input: string): Promise<string> {
  const decoder = new TextDecoder()

  // UTF-16コードユニット列をUint16Arrayとして再構成
  const codeUnits = new Uint16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    codeUnits[i] = input.charCodeAt(i)
  }

  // Uint16ArrayからUint8Arrayを参照取得
  const bytes = new Uint8Array(codeUnits.buffer)
  const dataView = new DataView(bytes.buffer)

  // 先頭4バイトから圧縮データの実際の長さを取得
  const length = dataView.getUint32(0, true)

  // 圧縮データ部分を切り出し
  const compressedBytes = bytes.subarray(4, 4 + length)

  // 解凍
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
