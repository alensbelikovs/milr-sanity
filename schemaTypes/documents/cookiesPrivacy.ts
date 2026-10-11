import {defineField, defineType} from 'sanity'
import {LockIcon} from '@sanity/icons/Lock'

/**
 * The cookies & privacy page. A singleton pinned to the document id `cookiesPrivacy`
 * (see `structure/index.ts`).
 */
export const cookiesPrivacy = defineType({
  name: 'cookiesPrivacy',
  title: 'Cookies & privacy',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({
      name: 'effectiveDate',
      title: 'Effective as of',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedDate',
      title: 'Updated as of',
      type: 'date',
      description: 'Leave empty until the policy changes.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayPolicyText',
      description: 'A heading is shown above the paragraph that follows it.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {effectiveDate: 'effectiveDate', updatedDate: 'updatedDate'},
    prepare({effectiveDate, updatedDate}) {
      return {title: 'Cookies & privacy', subtitle: updatedDate ?? effectiveDate}
    },
  },
})
