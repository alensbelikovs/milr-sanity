import {getCliClient} from 'sanity/cli'

/**
 * One-off: deletes every `work` and every `service`/`solution` document (published and drafts)
 * in a single transaction. Clears `proudestWork.work` first, since that strong reference would
 * otherwise block deleting the featured work.
 *
 *   npx sanity exec scripts/deleteWorksAndSolutions.ts --with-user-token
 */
const client = getCliClient({apiVersion: '2025-01-01'})

const ids: string[] = await client.fetch(`*[_type in ["work", "service", "solution"]]._id`)
console.log(`Deleting ${ids.length} documents`)

const featured: string[] = await client.fetch(
  `*[_id in ["proudestWork", "drafts.proudestWork"] && defined(work)]._id`,
)

const tx = client.transaction()
featured.forEach((id) => tx.patch(id, (patch) => patch.unset(['work'])))
ids.forEach((id) => tx.delete(id))
await tx.commit({visibility: 'sync'})

console.log('Done')
