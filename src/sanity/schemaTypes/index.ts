import { type SchemaTypeDefinition } from 'sanity'
import { motorcycle } from './motorcycle'
import { homepage } from './homepage'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [motorcycle, homepage],
}
