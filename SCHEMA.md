# Content Schemas

Reference for the schema types registered in this Studio. Source of truth lives in
[`schemaTypes/`](schemaTypes/); this doc mirrors it for frontend and API consumers.

Registered in [`schemaTypes/index.ts`](schemaTypes/index.ts) and wired into the Studio via
`sanity.config.ts` (`projectId: 7dil1d5q`, dataset `production`).

## Types at a glance

| Type                 | Kind      | Purpose                                          |
| -------------------- | --------- | ------------------------------------------------ |
| `work`               | document  | A portfolio work entry                           |
| `post`               | document  | A short post linking out to an external URL      |
| `solution`           | document  | A solution offered, referenced by works          |
| `sector`             | document  | Taxonomy: what sector the work sits in           |
| `testimonial`        | document  | A reusable quote from a client                   |
| `generalInformation` | singleton | Site-wide contact, hours, address, socials       |
| `media`              | object    | Shared image type (hotspot + `alt`)              |
| `socialLink`         | object    | `{title, url}` pair used by `generalInformation` |
| `openingHours`       | object    | Day range + time range                           |
| `address`            | object    | Postal address                                   |

## Relationships

```
work ─────────sector[]───────▶ sector        (references, optional — many per work)
work ─────────testimonial────▶ testimonial   (reference, optional — reusable across works)
work ─────────solutions[]────▶ solution      (references, optional — many per work)
```

Every relationship is **one-directional**: `work` points outward, and none of the referenced types
hold references back. Bidirectional references have to be kept in sync by hand and
double the writes on every edit, so the inverse is a query instead:

```groq
*[_type == "work" && $sectorId in sector[]._ref]
*[_type == "work" && testimonial._ref == $testimonialId]
*[_type == "work" && $solutionId in solutions[]._ref]
```

All references are strong (Sanity's default): a document cannot be deleted while another document
still references it. In particular, a `solution` cannot be deleted while any work still lists it.

## Conventions

### `media` — the one image type

All images (`work.img`, `work.gallery[]`, `post.img`, `solution.img`, `generalInformation.img`)
use the shared `media` object, so hotspot support and the `alt` field are defined exactly once in
[`schemaTypes/objects/media.ts`](schemaTypes/objects/media.ts). Every single-image field is named
`img`.

| Field | Type     | Required | Notes                                               |
| ----- | -------- | -------- | --------------------------------------------------- |
| `alt` | `string` | no       | Describes the image for screen readers and crawlers |

`alt` carries no validation, so it is absent on any image whose editor left it blank — including
images on required fields, where only the picture itself is enforced. Fall back to an empty string
rather than printing `undefined`:

```tsx
<img src={urlFor(image).url()} alt={image.alt ?? ''} />
```

Because it is a named type, array members come back as `_type: "media"`, not `_type: "image"`. It is
a plain Sanity `image` underneath, so it works directly with `@sanity/image-url`.

### Generated slugs

`work.slug`, `solution.slug`, and `sector.slug` all use Sanity's built-in `slug` type with
`options: {source: 'title', maxLength: 96}`. The editor presses **Generate** and the value is
derived from that document's `title`.

Sanity's default slugify lowercases and hyphenates but does **not** fold diacritics, so "Kārlis
Villa" becomes `kārlis-villa` rather than `karlis-villa`. Percent-encode when building URLs, or add
an `options.slugify` function to the field if ASCII-only slugs are wanted.

Slugs are not recomputed when a title changes — the editor regenerates deliberately. Add redirects
if the URL is already public.

### `_createdAt`

`_createdAt` is a Sanity **system field** — it exists on every document automatically and is always
set, so it is not (and must not be) declared in the schema. Project it like any other field:

```groq
*[_type == "post"] | order(_createdAt desc){_id, title, _createdAt}
```

`work` has a "Newest first" Studio ordering built on it; `post` has both "Newest first" and "Oldest
first".

### Singletons

There is no `singleton: true` schema option. `generalInformation` is a singleton because of two
pieces of configuration, both driven by the `SINGLETONS` list in
[`structure/index.ts`](structure/index.ts):

- **Structure** pins each type to a fixed document id equal to its type name, lists it at the top
  of the Studio sidebar, and removes it from the generic document lists.
- **`sanity.config.ts`** hides it from the "create new document" menu and strips its _duplicate_,
  _delete_, and _unpublish_ actions, so exactly one can ever exist.

Query singletons by id, which is cheaper than a type scan:

```groq
*[_id == "generalInformation"][0]
```

To add another singleton, add its type name to `SINGLETONS` and a matching `S.listItem()` in the
structure.

## `work` (document)

Mirrors the frontend's `WorkBroad` type (`WorkNarrow` is the `title`/`slug`/`img` subset used for
cards).

| Field         | Type                                | Required | Notes                                 |
| ------------- | ----------------------------------- | -------- | ------------------------------------- |
| `title`       | `string`                            | yes      |                                       |
| `subtitle`    | `string`                            | yes      |                                       |
| `slug`        | `slug`                              | yes      | Generated from `title` (max 96 chars) |
| `featured`    | `boolean`                           | yes      | Defaults to `false` on new works      |
| `img`         | `media`                             | yes      | Lead image                            |
| `sector`      | `array` of `reference` → `sector`   | no       | Unique                                |
| `solutions`   | `array` of `reference` → `solution` | no       | Unique                                |
| `location`    | `object`                            | no       | `{city, country}`, both required      |
| `area`        | `number`                            | no       | Floor area in m², positive            |
| `testimonial` | `reference` → `testimonial`         | no       |                                       |
| `gallery`     | `array` of `media`                  | no       |                                       |
| `description` | `text`                              | yes      | 8 rows                                |
| `_createdAt`  | system                              | auto     | Set by Sanity                         |

Everything except `title`, `subtitle`, `slug`, `featured`, `img`, and `description` is optional, so
treat every other field as possibly absent. The Studio unsets empty arrays, so an empty `sector`,
`solutions`, or `gallery` comes back missing rather than `[]`.

Required fields are enforced on publish, not backfilled: works published before `subtitle` or
`featured` existed have no value for them until an editor republishes. Fall back accordingly, and
filter with `featured == true` rather than `featured != false`.

`featured` flags any number of works; new works start at `false`.

`location` is an inline object rather than a reference because a city/country pair is not shared or
separately editable. The object itself is optional, but once it is filled in both `city` and
`country` are required. If the editor leaves it empty the whole object is unset, so guard the
parent before reading `city` or `country`.

```tsx
const place = [work.location?.city, work.location?.country].filter(Boolean).join(', ')
```

`area` is a plain number in **square metres** — the unit lives in the schema description and in the
frontend, never in the stored value. Format it at render time.

`sector` and `solutions` are arrays of references. Project each with `_key` and dereference in the
same step (see [Querying](#querying)).

Preview title is `title`, subtitle the first `sector`.

## `post` (document)

| Field         | Type     | Required | Notes               |
| ------------- | -------- | -------- | ------------------- |
| `img`         | `media`  | yes      |                     |
| `title`       | `string` | yes      |                     |
| `description` | `text`   | yes      | 5 rows              |
| `url`         | `url`    | yes      | `http`/`https` only |
| `_createdAt`  | system   | auto     | Set by Sanity       |

A post is a link-out card: it has no slug and no page of its own.

## `solution` (document)

| Field         | Type     | Required | Notes                                 |
| ------------- | -------- | -------- | ------------------------------------- |
| `img`         | `media`  | yes      |                                       |
| `title`       | `string` | yes      |                                       |
| `slug`        | `slug`   | yes      | Generated from `title` (max 96 chars) |
| `description` | `text`   | yes      | 5 rows                                |

Solutions are a shared vocabulary: each one is written once and referenced by any number of works
through `work.solutions`. The same list doubles as the site-wide "what we do" section, which is why a
solution carries its own `img` and `description` rather than being a bare label.

## `sector` (document)

| Field   | Type     | Required | Notes                                 |
| ------- | -------- | -------- | ------------------------------------- |
| `title` | `string` | yes      |                                       |
| `slug`  | `slug`   | yes      | Generated from `title` (max 96 chars) |

The shape of the frontend's `WorkFilter`. Membership is expressed on `work` (`sector`).

Formerly `category`. Documents created under that type keep `_type: "category"` and are not picked
up by the `sector` type until they are migrated.

## `testimonial` (document)

| Field         | Type     | Required | Notes                                   |
| ------------- | -------- | -------- | --------------------------------------- |
| `author`      | `string` | yes      | Who is speaking, e.g. "Kārlis and Līga" |
| `description` | `string` | yes      | The clause after the comma              |
| `text`        | `text`   | yes      | The quote itself, 5 rows                |

`author` and `description` are the two halves of a single attribution line, split so the frontend
can style them independently:

```tsx
<figcaption>
  {testimonial.author}, <span>{testimonial.description}</span>
</figcaption>
```

renders "Kārlis and Līga, reflecting on their first summer in the house".

## `generalInformation` (singleton)

Document id: `generalInformation`. See [Singletons](#singletons).

| Field     | Type                    | Required | Notes                             |
| --------- | ----------------------- | -------- | --------------------------------- |
| `img`     | `media`                 | yes      |                                   |
| `email`   | `string`                | yes      | Validated as an email             |
| `phone`   | `string`                | yes      | Free text, e.g. `+371 20 123 456` |
| `socials` | `array` of `socialLink` | yes      | At least one                      |
| `hours`   | `openingHours`          | yes      |                                   |
| `address` | `address`               | yes      |                                   |

`phone` is stored exactly as typed — the schema asks the editor for a country code (`+371 20 123
456`) but does not enforce one, so format or normalise it at render time if the markup needs a
`tel:` href.

In the Studio the fields are split into three tabs: **Contact** (`email`, `phone`, `socials`),
**Location** (`hours`, `address`), and **Media** (`img`).

### `socialLink` (object)

| Field   | Type     | Required | Notes                      |
| ------- | -------- | -------- | -------------------------- |
| `title` | `string` | yes      | Platform name, "Instagram" |
| `url`   | `url`    | yes      | `http`/`https` only        |

### `openingHours` (object)

| Field          | Type     | Required | Notes                                       |
| -------------- | -------- | -------- | ------------------------------------------- |
| `workFromDay`  | `string` | yes      | Weekday slug, `monday` … `sunday`           |
| `workToDay`    | `string` | yes      | Must not fall earlier in the week than from |
| `workHourFrom` | `string` | yes      | 24-hour `HH:MM`, zero padded                |
| `workHourTo`   | `string` | yes      | Must be after `workHourFrom`                |

Times are zero-padded `HH:MM` strings, which sort and compare correctly as plain strings — no date
parsing needed on either side.

Days are stored as the lowercase slugs above, never as the display labels the Studio shows, so map
them to whatever casing or language the frontend prints. A new singleton starts at `monday` →
`friday`, which is what an editor who never touched the field leaves behind.

### `address` (object)

| Field          | Type     | Required | Notes                                 |
| -------------- | -------- | -------- | ------------------------------------- |
| `streetName`   | `string` | yes      |                                       |
| `streetNumber` | `string` | yes      | Text, so "12A" and "5-7" are possible |
| `postalCode`   | `string` | yes      |                                       |
| `city`         | `string` | yes      |                                       |
| `country`      | `string` | yes      |                                       |

## Querying

```groq
// A single work with everything resolved
*[_type == "work" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  subtitle,
  slug,
  featured,
  img,
  description,
  // _key identifies the array item and does not survive the ->, so each item is projected and
  // dereferenced in the same step rather than followed with sector[]->{...}.
  sector[]{_key, "title": @->title, "slug": @->slug},
  solutions[]{
    _key,
    "title": @->title,
    "slug": @->slug,
    "description": @->description,
    "img": @->img
  },
  testimonial->{author, description, text},
  location,
  area,
  gallery[]{
    _key,
    alt,
    hotspot,
    crop,
    asset->{_id, url, metadata{lqip, dimensions{width, height}}}
  }
}

// Work cards, newest first
*[_type == "work"] | order(_createdAt desc){_id, title, slug, img}

// Featured work cards, newest first
*[_type == "work" && featured == true] | order(_createdAt desc){_id, title, slug, img}

// Sectors with a work count
*[_type == "sector"]{
  _id,
  title,
  "workCount": count(*[_type == "work" && ^._id in sector[]._ref])
}

// Site-wide details
*[_id == "generalInformation"][0]{
  img,
  email,
  phone,
  socials[]{_key, title, url},
  hours,
  address
}
```

### Gallery images

Each item in `work.gallery` is an inline `media` object, so the array comes back in document order
with no dereferencing. Sanity assigns every object array item a `_key` — always project it and use
it as the React `key`; index keys break Visual Editing overlays.

`metadata.lqip` is not returned automatically — project it explicitly if you want blur placeholders.

```tsx
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({projectId: '7dil1d5q', dataset: 'production'})
const urlFor = (source) => builder.image(source)

export function Gallery({gallery}) {
  if (!gallery?.length) return null

  return (
    <ul>
      {gallery.map((image) => (
        <li key={image._key}>
          <img
            src={urlFor(image).width(1200).fit('crop').auto('format').url()}
            alt={image.alt || ''}
            width={image.asset?.metadata?.dimensions?.width}
            height={image.asset?.metadata?.dimensions?.height}
            loading="lazy"
          />
        </li>
      ))}
    </ul>
  )
}
```

Passing the whole `media` object to `urlFor` (not just `asset.url`) is what lets the builder apply
the editor's hotspot and crop when it resizes.
