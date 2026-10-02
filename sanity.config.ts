import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETONS, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'milr-sanity',

  projectId: '7dil1d5q',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

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
