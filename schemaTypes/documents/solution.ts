import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

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
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', media: 'img'},
  },
})
