import {defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons/Clock'

const WEEKDAYS = [
  {title: 'Monday', value: 'monday'},
  {title: 'Tuesday', value: 'tuesday'},
  {title: 'Wednesday', value: 'wednesday'},
  {title: 'Thursday', value: 'thursday'},
  {title: 'Friday', value: 'friday'},
  {title: 'Saturday', value: 'saturday'},
  {title: 'Sunday', value: 'sunday'},
]

const WEEKDAY_ORDER = WEEKDAYS.map((day) => day.value)

/** 24-hour clock, zero padded: 09:00, 17:30, 23:59. */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const openingHours = defineType({
  name: 'openingHours',
  title: 'Opening hours',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'workFromDay',
      title: 'Open from (day)',
      type: 'string',
      options: {list: WEEKDAYS},
      initialValue: 'monday',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workToDay',
      title: 'Open to (day)',
      type: 'string',
      options: {list: WEEKDAYS},
      initialValue: 'friday',
      validation: (rule) =>
        rule.required().custom((toDay, context) => {
          const fromDay = (context.parent as {workFromDay?: string} | undefined)?.workFromDay
          if (!fromDay || !toDay) return true
          if (WEEKDAY_ORDER.indexOf(toDay) < WEEKDAY_ORDER.indexOf(fromDay)) {
            return 'The closing day must be the same as, or later in the week than, the opening day'
          }
          return true
        }),
    }),
    defineField({
      name: 'workHourFrom',
      title: 'Open from (time)',
      type: 'string',
      placeholder: '09:00',
      description: '24-hour clock, e.g. 09:00.',
      validation: (rule) =>
        rule.required().regex(TIME_PATTERN, {name: 'HH:MM'}).error('Use a 24-hour time like 09:00'),
    }),
    defineField({
      name: 'workHourTo',
      title: 'Open to (time)',
      type: 'string',
      placeholder: '17:00',
      description: '24-hour clock, e.g. 17:00.',
      validation: (rule) =>
        rule
          .required()
          .regex(TIME_PATTERN, {name: 'HH:MM'})
          .error('Use a 24-hour time like 17:00')
          .custom((to, context) => {
            const from = (context.parent as {workHourFrom?: string} | undefined)?.workHourFrom
            if (!from || !to || !TIME_PATTERN.test(from) || !TIME_PATTERN.test(to)) return true
            // Zero-padded HH:MM sorts correctly as a plain string.
            return to > from || 'The closing time must be after the opening time'
          }),
    }),
  ],
  preview: {
    select: {
      fromDay: 'workFromDay',
      toDay: 'workToDay',
      fromHour: 'workHourFrom',
      toHour: 'workHourTo',
    },
    prepare({fromDay, toDay, fromHour, toHour}) {
      const days = [fromDay, toDay].filter(Boolean).join(' - ')
      const hours = [fromHour, toHour].filter(Boolean).join(' - ')
      return {title: days || 'Opening hours', subtitle: hours}
    },
  },
})
