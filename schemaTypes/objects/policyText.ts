import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Rich text for the cookies & privacy page, limited to what the site renders: paragraphs,
 * h5 headings and links. Registered as a named type so it can be translated.
 */
export const policyText = defineType({
  name: 'policyText',
  title: 'Policy text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h5'},
      ],
      lists: [],
      marks: {
        decorators: [],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                description: 'A full URL, mailto:, tel:, or a site path such as /contact.',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
