import { picklist } from 'valibot'
import { langs } from './constants'

export const langSchema = picklist(langs)
