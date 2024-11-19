import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from '.'

describe(parse, () => {
  it('should parse schema.rb to JSON correctly', () => {
    const schemaText = fs.readFileSync(
      path.resolve(__dirname, './schemarb/input/schema1.in.rb'),
      'utf-8',
    )

    const result = parse(schemaText, 'schemarb')
    expect(result).toMatchSnapshot()
  })
})
