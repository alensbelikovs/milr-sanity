import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {english} from '../lib/localized'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'img',
      title: 'Image',
      type: 'media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Where the post links out to.',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .error('Must start with http:// or https://'),
    }),
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Newest first',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      name: 'createdAtAsc',
      title: 'Oldest first',
      by: [{field: '_createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', createdAt: '_createdAt', media: 'img'},
    prepare({title, createdAt, media}) {
      return {title: english(title), subtitle: createdAt?.slice(0, 10), media}
    },
  },
})
