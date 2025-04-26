import { describe, expect, it } from 'vitest'
import { generateRandomIdentifier } from './generateRandomIdentifier.js'

describe('generateRandomIdentifier', () => {
  it('should generate random identifier with given length', () => {
    expect(generateRandomIdentifier(4)).toHaveLength(4)
    expect(generateRandomIdentifier(10)).toHaveLength(10)
  })

  it('should only contain alphanumeric characters', () => {
    expect(/^[a-f0-9]+$/.test(generateRandomIdentifier(100))).toBe(true)
  })

  it('should return different values on multiple calls', () => {
    // A collision is possible, though the probability is extremely low (16^{-10}, roughly 1 in 1,000,000,000)
    const result1 = generateRandomIdentifier(10)
    const result2 = generateRandomIdentifier(10)
    expect(result1).not.toBe(result2)
  })
})
