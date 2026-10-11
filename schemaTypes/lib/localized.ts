/** One item of an `internationalizedArray*` field, as stored by sanity-plugin-internationalized-array. */
type LocalizedItem = {language?: string; value?: string}

export const LANGUAGES = [
  {id: 'en', title: 'English'},
  {id: 'lv', title: 'Latvian'},
]

/**
 * The English value of a translated field, for slug sources and previews, which only see the raw
 * array. Plain strings (documents not yet migrated) pass through.
 */
export function english(value: LocalizedItem[] | string | undefined): string | undefined {
  if (typeof value === 'string') return value
  return value?.find((item) => item.language === 'en')?.value
}

/** Slug source for a document whose title is translated. */
export const englishSource = (field: string) => (doc: Record<string, unknown>) =>
  english(doc[field] as LocalizedItem[] | undefined) ?? ''
