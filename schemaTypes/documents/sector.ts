import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'
import {english, englishSource} from '../lib/localized'

export const sector = defineType({
  name: 'sector',
  title: 'Sector',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: englishSource('title'), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({title: english(title), subtitle}),
  },
})
