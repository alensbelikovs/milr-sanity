import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {LANGUAGES} from './schemaTypes/lib/localized'
import {SINGLETONS, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'milr-sanity',

  projectId: '7dil1d5q',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    // Translated fields store one {language, value} item per language; the site falls back to English
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text', 'policyText'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons are reached through the structure entry above, never created ad hoc.
    newDocumentOptions: (prev) =>
      prev.filter((template) => !SINGLETONS.includes(template.templateId)),
    actions: (prev, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(
            ({action}) => action !== 'duplicate' && action !== 'delete' && action !== 'unpublish',
          )
        : prev,
  },
})
