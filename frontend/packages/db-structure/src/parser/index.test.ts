import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import Parser from '.'

describe('Schema Parser', () => {
  it('should parse schema.rb to JSON correctly', () => {
    const schemaText = fs.readFileSync(
      path.resolve(__dirname, './schemarb/input/schema1.in.rb'),
      'utf-8',
    )
    const expectedJson = fs.readFileSync(
      path.resolve(__dirname, './schemarb/output/schema1.out.json'),
      'utf-8',
    )

    const result = Parser.parse(schemaText, 'schemarb')
    expect(result).toEqual(JSON.parse(expectedJson))
  })
})
