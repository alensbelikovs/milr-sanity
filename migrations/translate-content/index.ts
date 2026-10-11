import {at, defineMigration, set} from 'sanity/migrate'

/**
 * Stores every post, work, testimonial, sector and solution text in both languages. Posts were
 * written in Latvian, the rest in English; each field is set to [en, lv], replacing what was there.
 * Also swaps the city and country two works had the wrong way round.
 *
 *   npx sanity migration run translate-content            # dry run
 *   npx sanity migration run translate-content --no-dry-run
 */

type Pair = [en: string, lv: string]
type Fields = Record<string, Pair>

const POST_TITLES: Record<string, Pair> = {
  '0f3c10d9-f3a3-4fa3-9e2d-3a2a34a52f25': [
    "Interior design isn't just for the wealthy",
    'Interjera dizains nav domāts tikai turīgajiem',
  ],
  '10a12e39-4c49-4546-9042-6f306aa239d3': [
    "Every day you live in a Bauhaus home. And you don't even know it",
    'Katru dienu tu dzīvo Bauhaus mājā. Un tu par to pat nezini',
  ],
  '1f3c0f96-5cd5-40f7-a893-defc605b6955': [
    "An interior becomes interesting when it isn't perfect",
    'Interjers kļūst interesants tad, kad tas nav ideāls',
  ],
  '20c46c07-0325-41b0-aea4-8f8028efa939': [
    'Good planning focuses on movement, not furniture',
    'Labs plānojums koncentrējas uz kustību, nevis mēbelēm',
  ],
  '3638f486-08a9-4b64-a059-2752ceb9cb95': [
    'Empty space isn\'t empty: the Japanese principle of "Ma"',
    'Tukša telpa nav tukša: japāņu "Ma" princips',
  ],
  '3ac6af45-2088-4e40-8abb-30fb9febbbe5': [
    'From a 9 to 5 to interior design',
    'No 9 līdz 5 uz interjera dizainu',
  ],
  '3c7b10a0-d421-4b3d-85ad-791d29316b06': [
    "An expensive interior isn't made by the total on the bill, but by proportions, materials and details",
    'Dārgu interjeru nerada cipars rēķina beigās, bet gan proporcijas, materiāli un detaļas',
  ],
  '51953f82-4077-4d5b-9e04-0d65569bf2d0': [
    'If your horoscope were an interior, this is what it would look like',
    'Ja tavs horoskops būtu interjers – tas izskatītos šādi',
  ],
  '59c6ada9-838f-489c-b053-6f2abff5ba3a': [
    'A basement is a chance to create new and unique sensations',
    'Pagrabs ir iespēja radīt jaunas un unikālas sajūtas',
  ],
  '75868a7c-54dc-4581-9125-755ba685369f': [
    'Shelter alone has never been enough for people. We also need a feeling',
    'Cilvēkam nekad nav pieticis tikai ar pajumti. Mums ir vajadzīga arī sajūta',
  ],
  '82d6f407-7d1f-43f7-b0aa-b0a4fcc1e67e': [
    'Maybe your star sign is why you prefer dark stone to light wood',
    'Varbūt tava horoskopa zīme ir iemesls, kāpēc tev patīk tumšs akmens, nevis gaišs koks',
  ],
  '9e943ba8-6853-4186-a77c-433ec04b6569': [
    "If I started over today, I'd do these three things differently",
    'Ja es šodien sāktu no jauna, šīs trīs lietas darītu savādāk',
  ],
  'a9559af1-503d-4ef4-bb65-77aef3c82667': [
    'You form your first impression of a space within seconds',
    'Pirmo iespaidu par telpu tu izdari dažu sekunžu laikā',
  ],
  'b0ff543a-d6c1-49a0-9a6b-ec8937bf5fdc': [
    "You don't touch every part of a space the same way – the materials shouldn't be the same either",
    'Tu nepieskaries visai telpai vienādi – arī materiāliem nevajadzētu būt vienādiem',
  ],
  'ba23a3a2-91c7-4927-b942-2fd67016e415': [
    'Sometimes the best decision is to use one material well, not several at random',
    'Dažreiz labākais lēmums ir izmantot vienu materiālu pareizi, nevis vairākus nejauši',
  ],
  'c0cde3f7-f774-45b1-9182-039164dcdde8': [
    'A space can shape emotions before a conversation even begins',
    'Telpa var kontrolēt emocijas vēl pirms sākas dialogs',
  ],
  'd41517a9-9741-488d-b4a0-92856ea492ba': [
    "It's been two months since I left a stable job to follow my dream",
    'Pagājuši divi mēneši kopš es aizgāju no stabila darba, lai sekotu savam sapnim',
  ],
  'f7b5b427-eb52-404f-baf8-f92e0db024b6': [
    'The best example of world-building is hidden in our surroundings',
    'Labākais pasaules veidošanas piemērs slēpjas vidē',
  ],
  'fca591ba-e6b7-4df2-8442-357dd3e14a57': [
    'An interior that looks straight out of a magazine, but is made for living',
    'Interjers, kas izskatās kā no žurnāla, bet radīts dzīvošanai',
  ],
}

const RIGA: Fields = {'location.city': ['Riga', 'Rīga'], 'location.country': ['Latvia', 'Latvija']}

// Work titles are project codes, the same in both languages
const WORK: Record<string, Fields> = {
  '02749cad-5691-4575-85bf-deceaeb4ce2f': {
    title: ['MR-006', 'MR-006'],
    subtitle: ['Classic Playful Concept', 'Klasiski rotaļīgs koncepts'],
    description: [
      'This concept blends timeless elegance with a playful spirit, creating an interior that feels refined yet inviting. Classic architectural details meet modern shapes, soft lines, and carefully chosen colors that bring warmth and personality to the space. The result is a balanced home where elegance meets creativity.',
      'Šis koncepts apvieno mūžīgu eleganci ar rotaļīgu garu, radot interjeru, kas šķiet izsmalcināts, tomēr aicinošs. Klasiskas arhitektūras detaļas satiekas ar modernām formām, maigām līnijām un rūpīgi izvēlētām krāsām, kas telpai piešķir siltumu un raksturu. Rezultāts ir līdzsvarots mājoklis, kurā elegance satiekas ar radošumu.',
    ],
  },
  '5088c639-4efb-45d9-9241-8eca5b332e5d': {
    title: ['MR-014', 'MR-014'],
    subtitle: ['Modern Heritage Concept', 'Mūsdienīga mantojuma koncepts'],
    description: [
      'A contemporary interior with strong historical character. Dark wood, patterned wallpaper, classic textiles, and traditional forms are paired with a cleaner layout and modern details. The result feels warm, mature, and elegant, without ever feeling stuck in the past.',
      'Mūsdienīgs interjers ar spēcīgu vēsturisku raksturu. Tumšs koks, rakstainas tapetes, klasiski tekstili un tradicionālas formas ir apvienotas ar skaidrāku plānojumu un modernām detaļām. Rezultāts ir silts, nobriedis un elegants, taču nekad nešķiet iestrēdzis pagātnē.',
    ],
  },
  '68079918-e7e9-41eb-a200-75a314698748': {
    title: ['MR-005', 'MR-005'],
    subtitle: ['Warm Editorial Concept', 'Silts žurnāla stila koncepts'],
    description: [
      'Design concept inspired by the mood of high-end interior and fashion photography. Rather than relying on decorative architecture, it focuses on composition, light, and carefully chosen furniture. Every piece is selected with intention to create balance, depth, and a sense of visual calm.',
      'Dizaina koncepts, ko iedvesmojusi augstas klases interjera un modes fotogrāfijas noskaņa. Tā vietā, lai paļautos uz dekoratīvu arhitektūru, tas koncentrējas uz kompozīciju, gaismu un rūpīgi izvēlētām mēbelēm. Katrs priekšmets ir izvēlēts apzināti, lai radītu līdzsvaru, dziļumu un vizuāla miera sajūtu.',
    ],
  },
  '7d390bca-a045-44ed-8949-3c3241e912e8': {
    title: ['MR-004', 'MR-004'],
    subtitle: ['Rhythm and Silence', 'Ritms un klusums'],
    description: [
      "This interior is designed to balance a busy daily life with a sense of calm. The kitchen and living area come together as one composition, where materials, textures, and light flow naturally into each other. The existing furniture isn't treated as a limitation but as the foundation for a new identity, given fresh meaning within the overall design.",
      'Šis interjers ir veidots, lai līdzsvarotu aizņemtu ikdienu ar miera sajūtu. Virtuve un dzīvojamā zona apvienojas vienā kompozīcijā, kurā materiāli, faktūras un gaisma dabiski pāriet cits citā. Esošās mēbeles netiek uztvertas kā ierobežojums, bet gan kā pamats jaunai identitātei, kopējā dizainā iegūstot jaunu nozīmi.',
    ],
  },
  '90f3ff2a-6c46-4f6e-b320-adae64940f96': {
    title: ['MR-008', 'MR-008'],
    subtitle: ['Wellness Boutique Center Concept', 'Butika labsajūtas centra koncepts'],
    description: [
      'Boutique wellness center where visitors can step away from the pace of everyday life. Soft architectural forms, natural textures, warm lighting, and a restrained material palette create a quiet, private atmosphere. Instead of imitating nature, the space brings a sense of calm through light, materials, and layout, offering a refined place for rest and wellbeing.',
      'Butika labsajūtas centrs, kurā apmeklētāji var atrauties no ikdienas steigas. Maigas arhitektūras formas, dabiskas faktūras, silts apgaismojums un atturīga materiālu palete rada klusu, privātu atmosfēru. Tā vietā, lai atdarinātu dabu, telpa rada miera sajūtu ar gaismu, materiāliem un plānojumu, piedāvājot izsmalcinātu vietu atpūtai un labsajūtai.',
    ],
    ...RIGA,
  },
  'a68bb83e-0806-450b-be68-91e21c486c6f': {
    title: ['MR-008/1', 'MR-008/1'],
    subtitle: ['Modern Wellness SPA', 'Mūsdienīgs labsajūtas SPA'],
    description: [
      "A modern wellness interior that brings together warm oak, natural stone, deep burgundy tones, and textured glass. It's designed as a calm journey through light, materials, and water, creating a warm and enveloping spa experience.",
      'Mūsdienīgs labsajūtas interjers, kas apvieno siltu ozolu, dabīgo akmeni, dziļus bordo toņus un faktūrainu stiklu. Tas veidots kā mierīgs ceļojums caur gaismu, materiāliem un ūdeni, radot siltu un aptverošu SPA pieredzi.',
    ],
    ...RIGA,
  },
  'a6fe6b12-51af-488c-a05b-103cefecabdf': {
    title: ['MR-001', 'MR-001'],
    subtitle: ['MÁDARA Cosmetics SPA Concept', 'MÁDARA Cosmetics SPA koncepts'],
    description: [
      'A conceptual spa interior inspired by MÁDARA Cosmetics and its connection to Nordic nature, purity, and wellbeing. Natural stone, stainless steel, deep green tones, and botanical shadow play create a calm yet expressive atmosphere, where the brand comes through in materials, light, and form.',
      'Konceptuāls SPA interjers, ko iedvesmojusi MÁDARA Cosmetics un tās saikne ar Ziemeļu dabu, tīrību un labsajūtu. Dabīgais akmens, nerūsējošais tērauds, dziļi zaļi toņi un botānisku ēnu spēle rada mierīgu, tomēr izteiksmīgu atmosfēru, kurā zīmols atklājas materiālos, gaismā un formā.',
    ],
  },
  'd9e9e0c2-aa8a-4134-8230-02b2ac443fdf': {
    title: ['MR-003', 'MR-003'],
    subtitle: ['Warm Editorial Concept', 'Silts žurnāla stila koncepts'],
    description: [
      'This concept pairs understated classic elegance with modern functionality. Simple classic details, comfortable contemporary furniture, and integrated technology come together in an interior that feels harmonious, elegant, and practical for everyday life.',
      'Šis koncepts apvieno atturīgu klasisku eleganci ar mūsdienīgu funkcionalitāti. Vienkāršas klasiskas detaļas, ērtas mūsdienīgas mēbeles un integrētas tehnoloģijas apvienojas interjerā, kas šķiet harmonisks, elegants un praktisks ikdienas dzīvei.',
    ],
    ...RIGA,
  },
}

const TESTIMONIALS: Record<string, Fields> = {
  'bc04f688-5a61-4e02-a8d5-6ada22321087': {
    author: ['Kārlis and Santa', 'Kārlis un Santa'],
    description: ['Reflecting on their new home', 'Par savām jaunajām mājām'],
    text: [
      "\"Rinalds asked us so many questions before we even started, how we spend our mornings, where we like to sit with coffee, what our evenings usually look like. It felt like he was really listening, not just designing a house. Now that we live here, we can feel it. The whole place just feels calm and warm, like it understands us. It's hard to put into words until you're actually standing in it.\"",
      '„Rinalds mums uzdeva tik daudz jautājumu, vēl pirms mēs vispār sākām – kā mēs pavadām rītus, kur mums patīk sēdēt ar kafiju, kā parasti paiet mūsu vakari. Šķita, ka viņš patiešām klausās, nevis vienkārši projektē māju. Tagad, kad dzīvojam šeit, mēs to jūtam. Visa vieta vienkārši šķiet mierīga un silta, it kā tā mūs saprastu. To ir grūti izteikt vārdos, kamēr pats tajā nestāvi.”',
    ],
  },
}

const SECTOR_TITLES: Record<string, Pair> = {
  'ee0263ad-a748-4708-a936-ec1a56e6fef0': ['Residential', 'Dzīvojamās telpas'],
  'be3dfc16-e5ae-4d2a-903c-d0e186a444d1': ['Commercial', 'Komerctelpas'],
  'bc730677-69c7-4531-9ae3-1db3d5f78d3a': ['Hospitality', 'Viesmīlība'],
  'c6490e1e-bdb6-43fc-8a45-982d279c485c': ['Healthcare', 'Veselības aprūpe'],
  'ec06ff3f-36a4-4f53-b090-ee2c48741b30': ['Office', 'Biroji'],
  'b5cf7992-6094-4f21-a993-b66510536098': ['Retail', 'Mazumtirdzniecība'],
}

const SOLUTIONS: Record<string, Fields> = {
  '6d00fb36-09f4-4fd0-8721-d4df36ef6092': {
    title: ['Layouts and Planning', 'Telpu plānošana'],
    description: [
      'Thoughtful floor plans that make every square meter count. Careful attention to flow, zoning, and furniture placement for open, practical spaces.',
      'Pārdomāti plānojumi, kuros katrs kvadrātmetrs ir izmantots lietderīgi. Rūpīga uzmanība kustībai, zonējumam un mēbeļu izvietojumam, lai telpas būtu atvērtas un praktiskas.',
    ],
  },
  '438fc491-b457-44e8-8223-90ecb217bf96': {
    title: ['Concept Visualization', 'Konceptu vizualizācija'],
    description: [
      'Realistic 3D renders and mood boards of the space before any work begins. An easy way to compare options and make confident decisions early on.',
      'Reālistiskas telpas 3D vizualizācijas un noskaņu dēļi vēl pirms darbu sākuma. Vienkāršs veids, kā salīdzināt variantus un jau laikus droši pieņemt lēmumus.',
    ],
  },
  'fe9e1a3e-b688-4c91-836b-d091b75f3bdb': {
    title: ['Space Optimization', 'Telpas optimizācija'],
    description: [
      'Clever storage and multi-use solutions for small or awkward spaces. Every corner put to good use, without compromising on style.',
      'Gudri uzglabāšanas un daudzfunkcionāli risinājumi mazām vai neērtām telpām. Katrs stūris izmantots lietderīgi, nezaudējot stilu.',
    ],
  },
  'bf1989c9-6193-46f1-b2f0-5e36fcdc4c76': {
    title: ['Sustainability Design', 'Ilgtspējīgs dizains'],
    description: [
      'Eco-friendly materials, energy-efficient lighting, and long-lasting products. A healthier choice for the home and a more responsible one for the planet.',
      'Videi draudzīgi materiāli, energoefektīvs apgaismojums un ilgmūžīgi produkti. Veselīgāka izvēle mājām un atbildīgāka – planētai.',
    ],
  },
  '20370c75-bd24-4adf-840a-0d54c32deb78': {
    title: ['Project Management', 'Projektu vadība'],
    description: [
      'Full coordination of contractors, suppliers, timelines, and budgets. A smooth, stress-free process with results true to the original vision.',
      'Pilnīga būvnieku, piegādātāju, termiņu un budžeta koordinēšana. Raits process bez liekas spriedzes, ar rezultātu, kas atbilst sākotnējai iecerei.',
    ],
  },
  '36c3f512-e3a5-4f3a-b623-513d95d472db': {
    title: ['Lighting Design', 'Apgaismojuma dizains'],
    description: [
      'Layered lighting plans combining natural light, ambient fixtures, and accent lighting. Spaces that feel right at every time of day, with their best features on display.',
      'Daudzslāņu apgaismojuma plāni, kas apvieno dabisko gaismu, vispārējo apgaismojumu un akcentu gaismas. Telpas, kas šķiet īstas jebkurā diennakts laikā un izceļ savas labākās iezīmes.',
    ],
  },
  'bf95c9f0-beeb-4d23-816c-0574236558a4': {
    title: ['Renovation and Remodeling', 'Renovācija un pārbūve'],
    description: [
      'Complete transformations of dated or awkward spaces into fresh, functional rooms. Suitable for anything from small refreshes to full-scale overhauls.',
      'Novecojušu vai neērtu telpu pilnīga pārvēršana svaigās, funkcionālās telpās. Piemērots gan nelieliem atsvaidzinājumiem, gan pilna apjoma pārbūvēm.',
    ],
  },
  'a8f4a882-506b-4265-be72-dac0b6c6efbb': {
    title: ['Acoustics Design', 'Akustikas dizains'],
    description: [
      'Quieter, more comfortable rooms through sound-absorbing materials, smart layouts, and acoustic treatments. Ideal for home offices, open-plan living areas, studios, and busy workplaces.',
      'Klusākas, ērtākas telpas ar skaņu absorbējošiem materiāliem, gudru plānojumu un akustiskiem risinājumiem. Ideāli piemērots mājas birojiem, atvērta plānojuma dzīvojamām zonām, studijām un rosīgām darbavietām.',
    ],
  },
}

// Only titles are translated on posts and sectors
const TITLES = {...POST_TITLES, ...SECTOR_TITLES}

// Multi-line fields per type use the text array, the rest the string one
const TEXT_FIELDS: Record<string, string> = {work: 'description', testimonial: 'text', solution: 'description'}

const localized = (docType: string, field: string, [en, lv]: Pair) => {
  const type = TEXT_FIELDS[docType] === field
    ? 'internationalizedArrayTextValue'
    : 'internationalizedArrayStringValue'
  return [
    {_key: 'en', _type: type, language: 'en', value: en},
    {_key: 'lv', _type: type, language: 'lv', value: lv},
  ]
}

export default defineMigration({
  title: 'Translate posts, work, testimonials, sectors and solutions',
  documentTypes: ['post', 'work', 'testimonial', 'sector', 'solution'],

  migrate: {
    document(doc) {
      // Drafts get the same text as their published document
      const id = doc._id.replace(/^drafts\./, '')
      const fields: Fields | undefined = TITLES[id]
        ? {title: TITLES[id]}
        : (WORK[id] ?? TESTIMONIALS[id] ?? SOLUTIONS[id])
      if (!fields) return []

      // A field that already has Latvian is left alone, so reruns keep edits made in the Studio
      const hasLatvian = (path: string) => {
        const value = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], doc)
        return Array.isArray(value) && value.some((item) => item?.language === 'lv')
      }

      return Object.entries(fields)
        .filter(([path]) => !hasLatvian(path))
        .map(([path, pair]) => at(path, set(localized(doc._type, path, pair))))
    },
  },
})
