import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'
import {english, englishSource} from '../lib/localized'

export const solution = defineType({
  name: 'solution',
  title: 'Solution',
  type: 'document',
  icon: StarIcon,
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: englishSource('title'), maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', media: 'img'},
    prepare: ({title, subtitle, media}) => ({title: english(title), subtitle: english(subtitle), media}),
  },
})
