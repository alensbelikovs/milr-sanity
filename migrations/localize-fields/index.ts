import {at, defineMigration, set, type NodePatch, type Path} from 'sanity/migrate'

/**
 * Moves every field that became translatable from a plain string to an internationalized array,
 * keeping the current text as the English entry. Already migrated fields are left alone, so the
 * migration can run more than once.
 *
 *   npx sanity migration run localize-fields            # dry run
 *   npx sanity migration run localize-fields --no-dry-run
 */

type Kind = 'String' | 'Text'

// Translated fields per document type; alt sits on every media image
const FIELDS: Record<string, [string[], Kind][]> = {
  work: [
    [['title'], 'String'],
    [['subtitle'], 'String'],
    [['description'], 'Text'],
    [['location', 'city'], 'String'],
    [['location', 'country'], 'String'],
    [['img', 'alt'], 'String'],
  ],
  post: [
    [['title'], 'String'],
    [['img', 'alt'], 'String'],
  ],
  solution: [
    [['title'], 'String'],
    [['description'], 'Text'],
    [['img', 'alt'], 'String'],
  ],
  sector: [[['title'], 'String']],
  testimonial: [
    [['author'], 'String'],
    [['description'], 'String'],
    [['text'], 'Text'],
  ],
  generalInformation: [
    [['address', 'city'], 'String'],
    [['address', 'country'], 'String'],
    [['img', 'alt'], 'String'],
  ],
}

const wrap = (value: string, kind: Kind) => [
  {
    _key: Math.random().toString(36).slice(2, 14),
    _type: `internationalizedArray${kind}Value`,
    language: 'en',
    value,
  },
]

const get = (node: unknown, path: string[]) =>
  path.reduce<unknown>((current, key) => (current as Record<string, unknown> | undefined)?.[key], node)

export default defineMigration({
  title: 'Localize text fields',
  documentTypes: Object.keys(FIELDS),

  migrate: {
    document(doc) {
      const patches: NodePatch[] = []
      const patch = (path: Path, value: unknown, kind: Kind) => {
        if (typeof value === 'string') patches.push(at(path, set(wrap(value, kind))))
      }

      for (const [path, kind] of FIELDS[doc._type] ?? []) patch(path, get(doc, path), kind)

      // Gallery images carry their own alt
      const gallery = doc.gallery as {_key: string; alt?: unknown}[] | undefined
      gallery?.forEach((image) => patch(['gallery', {_key: image._key}, 'alt'], image.alt, 'String'))

      return patches
    },
  },
})
