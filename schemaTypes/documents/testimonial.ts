import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'
import {english} from '../lib/localized'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'internationalizedArrayString',
      description: 'Who is speaking, e.g. "Karlis and Liga".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
      description:
        'The clause that follows the author, e.g. "reflecting on their first summer in the house". Rendered as "{author}, {description}".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayText',
      description: 'The quote itself.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {author: 'author', description: 'description', quote: 'text'},
    prepare({author, description, quote}) {
      return {
        title: [english(author), english(description)].filter(Boolean).join(', '),
        subtitle: english(quote),
      }
    },
  },
})
