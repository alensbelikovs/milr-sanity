import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'

/** Document types that must exist exactly once, pinned to a fixed document id. */
export const SINGLETONS = ['generalInformation']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('General information')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('generalInformation')
            .documentId('generalInformation')
            .title('General information'),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
