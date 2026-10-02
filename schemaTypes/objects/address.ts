import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'streetName',
      title: 'Street name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'streetNumber',
      title: 'Street number',
      type: 'string',
      description: 'Kept as text so entries like "12A" or "5-7" are possible.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      streetName: 'streetName',
      streetNumber: 'streetNumber',
      postalCode: 'postalCode',
      city: 'city',
      country: 'country',
    },
    prepare({streetName, streetNumber, postalCode, city, country}) {
      const street = [streetName, streetNumber].filter(Boolean).join(' ')
      return {
        title: street || 'Address',
        subtitle: [postalCode, city, country].filter(Boolean).join(', '),
      }
    },
  },
})
