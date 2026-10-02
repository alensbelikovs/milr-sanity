import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Who is speaking, e.g. "Karlis and Liga".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description:
        'The clause that follows the author, e.g. "reflecting on their first summer in the house". Rendered as "{author}, {description}".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 5,
      description: 'The quote itself.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {author: 'author', description: 'description', quote: 'text'},
    prepare({author, description, quote}) {
      return {
        title: [author, description].filter(Boolean).join(', '),
        subtitle: quote,
      }
    },
  },
})
