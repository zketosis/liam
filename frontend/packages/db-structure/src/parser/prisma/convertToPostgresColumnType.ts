import type { DMMF } from '@prisma/generator-helper'

// ref: https://www.prisma.io/docs/orm/reference/prisma-schema-reference#model-field-scalar-types
export function convertToPostgresColumnType(
  type: string,
  nativeType: DMMF.Field['nativeType'],
  defaultValue: DMMF.Field['default'] | null,
): string {
  if (nativeType) {
    const [nativeTypeName, nativeTypeArgs] = nativeType

    // If the default value includes 'autoincrement()', return the appropriate serial type
    if (
      typeof defaultValue === 'string' &&
      defaultValue.includes('autoincrement()')
    ) {
      switch (nativeTypeName) {
        case 'Int':
          return 'serial'
        case 'SmallInt':
          return 'smallserial'
        case 'BigInt':
          return 'bigserial'
        default:
          return nativeTypeName.toLowerCase()
      }
    }

    // If nativeType has arguments, format it as 'type(args)'
    // For example, when `price Decimal @db.Decimal(10, 2)`, type should be Decimal(10, 2)
    if (nativeTypeArgs.length > 0) {
      return `${nativeTypeName.toLowerCase()}(${nativeTypeArgs.join(',')})`
    }

    // Special case for 'DoublePrecision' to return 'double precision' with a space
    if (nativeTypeName === 'DoublePrecision') {
      return 'double precision'
    }
    return nativeTypeName.toLowerCase()
  }

  // If nativeType is not provided, use the Prisma field type to determine the PostgreSQL column type
  if (
    typeof defaultValue === 'string' &&
    defaultValue.includes('autoincrement()')
  ) {
    switch (type) {
      case 'Int':
        return 'serial'
      case 'BigInt':
        return 'bigserial'
      default:
        return type.toLowerCase()
    }
  }

  // Special case for 'uuid' default value
  if (typeof defaultValue === 'string' && defaultValue.includes('uuid')) {
    return 'uuid'
  }

  switch (type) {
    case 'String':
      return 'text'
    case 'Boolean':
      return 'boolean'
    case 'Int':
      return 'integer'
    case 'BigInt':
      return 'bigint'
    case 'Float':
      return 'double precision'
    case 'DateTime':
      return 'timestamp(3)'
    case 'Json':
      return 'jsonb'
    case 'Decimal':
      return 'decimal(65,30)'
    case 'Bytes':
      return 'bytea'
    default:
      return type
  }
}
