import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Site-wide details. A singleton: the Studio pins it to the document id
 * `generalInformation` (see `structure/index.ts`), so query it with
 * `*[_id == "generalInformation"][0]`.
 */
export const generalInformation = defineType({
  name: 'generalInformation',
  title: 'General information',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'contact', title: 'Contact', default: true},
    {name: 'location', title: 'Location'},
    {name: 'media', title: 'Media'},
  ],
  fields: [
    defineField({
      name: 'img',
      title: 'Image',
      type: 'media',
      group: 'media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'contact',
      description: 'Include the country code, e.g. +371 20 123 456.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socials',
      title: 'Socials',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'socialLink'})],
      validation: (rule) => rule.required().min(1).error('Add at least one social link'),
    }),
    defineField({
      name: 'hours',
      title: 'Opening hours',
      type: 'openingHours',
      group: 'location',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
      group: 'location',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {email: 'email', city: 'address.city', media: 'img'},
    prepare({email, city, media}) {
      return {
        title: 'General information',
        subtitle: [email, city].filter(Boolean).join(' - '),
        media,
      }
    },
  },
})
