import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the platform, e.g. "Instagram".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .error('Must start with http:// or https://'),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
  },
})
