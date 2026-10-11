import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {LockIcon} from '@sanity/icons/Lock'

/** Document types that must exist exactly once, pinned to a fixed document id. */
export const SINGLETONS = ['generalInformation', 'cookiesPrivacy']

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
      S.listItem()
        .title('Cookies & privacy')
        .icon(LockIcon)
        .child(
          S.document()
            .schemaType('cookiesPrivacy')
            .documentId('cookiesPrivacy')
            .title('Cookies & privacy'),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
