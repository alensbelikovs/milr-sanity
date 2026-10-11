import {address} from './objects/address'
import {media} from './objects/media'
import {openingHours} from './objects/openingHours'
import {policyText} from './objects/policyText'
import {socialLink} from './objects/socialLink'

import {cookiesPrivacy} from './documents/cookiesPrivacy'
import {sector} from './documents/sector'
import {generalInformation} from './documents/generalInformation'
import {post} from './documents/post'
import {solution} from './documents/solution'
import {testimonial} from './documents/testimonial'
import {work} from './documents/work'

export const schemaTypes = [
  // Documents
  work,
  post,
  solution,
  sector,
  testimonial,
  generalInformation,
  cookiesPrivacy,
  // Objects
  media,
  socialLink,
  openingHours,
  address,
  policyText,
]
