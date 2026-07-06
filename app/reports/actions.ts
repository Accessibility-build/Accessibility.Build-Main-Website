'use server'

import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publishedReports } from '@/lib/db/schema'

/** Delete a shared report the signed-in user owns. */
export async function deleteReport(slug: string): Promise<void> {
  const user = await currentUser()
  if (!user) throw new Error('Not signed in')
  await db
    .delete(publishedReports)
    .where(and(eq(publishedReports.slug, slug), eq(publishedReports.userId, user.id)))
  revalidatePath('/reports')
}
