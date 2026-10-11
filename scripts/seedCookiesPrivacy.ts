import {getCliClient} from 'sanity/cli'

/**
 * One-off: writes the English cookies & privacy text the site used to hardcode into the
 * `cookiesPrivacy` singleton. Replaces the whole document, so only run it before editing.
 *
 *   npx sanity exec scripts/seedCookiesPrivacy.ts --with-user-token
 */
const client = getCliClient({apiVersion: '2025-01-01'})

// A plain string, or [text, href] for a link
type Segment = string | [string, string]

const key = () => Math.random().toString(36).slice(2, 14)

function block(style: 'normal' | 'h5', segments: Segment[]) {
  const markDefs: {_key: string; _type: 'link'; href: string}[] = []
  const children = segments.map((segment) => {
    if (typeof segment === 'string') return {_key: key(), _type: 'span', text: segment, marks: []}
    const link = {_key: key(), _type: 'link' as const, href: segment[1]}
    markDefs.push(link)
    return {_key: key(), _type: 'span', text: segment[0], marks: [link._key]}
  })
  return {_key: key(), _type: 'block', style, markDefs, children}
}

const h = (text: string) => block('h5', [text])
const p = (...segments: Segment[]) => block('normal', segments)

const GOOGLE_PRIVACY = 'https://policies.google.com/privacy'

const body = [
  h('Introduction'),
  p(
    'This page explains what personal data Milr Studio collects through this website, why, and what your rights are.',
  ),
  h('Who I am'),
  p(
    'This website is run by me, Rinalds Miļicins, Milr Studio, Aleksandra Čaka 56, LV-1011, Rīga, Latvia. I am the controller of your personal data. If you have any questions about this policy, write to me at ',
    ['office@milrstudio.com', 'mailto:office@milrstudio.com'],
    ' or call ',
    ['+371 28 755 431', 'tel:+37128755431'],
    '.',
  ),
  h('What I collect'),
  p(
    'When you use the contact form, I collect your name, email address, the subject you choose, and your message. I use this only to reply to you and to discuss a possible project. My legal basis is your request to contact me and my legitimate interest in answering it.',
  ),
  p(
    'When you email or call me directly, I keep the contact details and information you share for the same purpose.',
  ),
  p(
    'When you visit the site, my hosting provider (Vercel) automatically processes technical data such as your IP address, browser type and the pages you request. This is needed to deliver the website securely and to keep it running.',
  ),
  p('I do not sell your data, and I do not use it for advertising.'),
  h('Cookies and third-party services'),
  p(
    'This website uses cookies for analytics and spam protection. I do not use cookies for advertising. Analytics cookies are only set if you agree to them, and you can change your choice at any time.',
  ),
  p(
    'Google Analytics helps me understand how visitors use the site, such as which pages are viewed, how long visits last, and roughly where visitors come from. It uses cookies and collects data about your device and browsing on this site. Google Analytics does not store full IP addresses. I use this information only in aggregated form to improve the website. My legal basis is your consent. See ',
    ["Google's Privacy Policy", GOOGLE_PRIVACY],
    '.',
  ),
  p(
    'Google reCAPTCHA protects the contact form from spam. It may set cookies and collect data about your device and interaction with the page. ',
    ["Google's Privacy Policy", GOOGLE_PRIVACY],
    ' and ',
    ['Terms of Service', 'https://policies.google.com/terms'],
    ' apply.',
  ),
  p('Vercel hosts the website. See ', ["Vercel's Privacy Policy", 'https://vercel.com/legal/privacy-policy'], '.'),
  p(
    'Sanity delivers the images and content on the site. See ',
    ["Sanity's Privacy Policy", 'https://www.sanity.io/legal/privacy'],
    '.',
  ),
  h('External Links'),
  p(
    'This website contains links to other sites, such as Instagram and TikTok. I am not responsible for the privacy practices of those sites. When you follow a link, their own privacy policies apply.',
  ),
  h('How long I keep your data'),
  p(
    'I keep enquiries and related correspondence for as long as needed to respond and, if we work together, for the duration of the project. If no project follows, I delete enquiries within 12 months. Client records may be kept longer where Latvian accounting or tax law requires it. Google Analytics data is kept for 14 months.',
  ),
  h('Your rights'),
  p(
    'Under the GDPR, you have the right to access the personal data I hold about you, to correct or delete it, to restrict or object to its processing, to receive it in a portable format, and to withdraw your consent at any time. To use any of these rights, email me at ',
    ['office@milrstudio.com', 'mailto:office@milrstudio.com'],
    '.',
  ),
  p(
    'If you believe your data has been handled unlawfully, you can lodge a complaint with the ',
    ['Latvian Data State Inspectorate (Datu valsts inspekcija)', 'https://www.dvi.gov.lv'],
    '.',
  ),
  h('Changes'),
  p(
    'I may update this policy from time to time. The date at the top shows when it was last changed.',
  ),
]

await client.createOrReplace({
  _id: 'cookiesPrivacy',
  _type: 'cookiesPrivacy',
  effectiveDate: '2026-10-07',
  updatedDate: '2026-10-08',
  body: [{_key: 'en', _type: 'internationalizedArrayPolicyTextValue', language: 'en', value: body}],
})

console.log('Done')
