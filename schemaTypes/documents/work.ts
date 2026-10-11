import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {english, englishSource} from '../lib/localized'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
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
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'img',
      title: 'Image',
      type: 'media',
      description: 'The lead image for the work.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'sector'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'solutions',
      title: 'Solutions',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'solution'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'city',
          title: 'City',
          type: 'internationalizedArrayString',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'internationalizedArrayString',
          validation: (rule) => rule.required(),
        }),
      ],
      options: {columns: 2},
    }),
    defineField({
      name: 'area',
      title: 'Area',
      type: 'number',
      description: 'Floor area in square metres.',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'testimonial'}],
      description: 'Optional. Testimonials are reusable across works.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional images, shown in the order listed here.',
      of: [defineArrayMember({type: 'media'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      name: 'createdAtDesc',
      title: 'Newest first',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      sector: 'sector.0.title',
      featured: 'featured',
      media: 'img',
    },
    // A star marks featured works in lists
    prepare({title, sector, featured, media}) {
      return {
        title: [featured && '★', english(title)].filter(Boolean).join(' '),
        subtitle: [featured && 'Featured', english(sector)].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
