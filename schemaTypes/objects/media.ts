import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Every image in the studio goes through this type, so hotspot support and the
 * alt-text field are defined exactly once.
 */
export const media = defineType({
  name: 'media',
  title: 'Media',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'internationalizedArrayString',
      description: 'Describes the image for screen readers and search engines.',
    }),
  ],
})
