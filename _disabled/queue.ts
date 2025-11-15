import { db } from '@/lib/db'
import { urlAccessibilityAudits } from '@/lib/db/schema'
import { eq, and, lt } from 'drizzle-orm'
import { processMultiToolAccessibilityAudit } from './multi-tool-audit-processor'

// Simple database-based queue system (no Redis needed)
const processingJobs = new Map<string, Promise<void>>()

// Add audit to processing queue
export async function queueAudit(auditId: string): Promise<void> {
  // Prevent duplicate processing
  if (processingJobs.has(auditId)) {
    return
  }

  // Start processing immediately with a small delay
  const processingPromise = new Promise<void>((resolve, reject) => {
    setTimeout(async () => {
      try {
        await processMultiToolAccessibilityAudit(auditId)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        // Clean up after processing
        processingJobs.delete(auditId)
      }
    }, 1000) // 1 second delay to ensure database transaction is committed
  })

  processingJobs.set(auditId, processingPromise)
}

// Get queue statistics from database
export async function getQueueStats() {
  try {
    const [pendingAudits, processingAudits, completedAudits, failedAudits] = await Promise.all([
      // Pending audits
      db.select()
        .from(urlAccessibilityAudits)
        .where(eq(urlAccessibilityAudits.status, 'pending')),
      
      // Processing audits
      db.select()
        .from(urlAccessibilityAudits)
        .where(eq(urlAccessibilityAudits.status, 'processing')),
      
      // Recently completed audits (last 24 hours)
      db.select()
        .from(urlAccessibilityAudits)
        .where(and(
          eq(urlAccessibilityAudits.status, 'completed'),
          lt(urlAccessibilityAudits.processingCompletedAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        )),
      
      // Recently failed audits (last 24 hours)
      db.select()
        .from(urlAccessibilityAudits)
        .where(and(
          eq(urlAccessibilityAudits.status, 'failed'),
          lt(urlAccessibilityAudits.updatedAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        ))
    ])

    return {
      waiting: pendingAudits.length,
      active: processingAudits.length + processingJobs.size, // Include in-memory processing
      completed: completedAudits.length,
      failed: failedAudits.length,
    }
  } catch (error) {
    console.error('Error getting queue stats:', error)
    return {
      waiting: 0,
      active: processingJobs.size,
      completed: 0,
      failed: 0,
    }
  }
}

// Clean up stalled jobs (jobs that have been "processing" for too long)
export async function cleanupStalledJobs(): Promise<void> {
  try {
    const stalledThreshold = new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    
    const stalledJobs = await db.select()
      .from(urlAccessibilityAudits)
      .where(and(
        eq(urlAccessibilityAudits.status, 'processing'),
        lt(urlAccessibilityAudits.processingStartedAt, stalledThreshold)
      ))

    if (stalledJobs.length > 0) {
      console.log(`Found ${stalledJobs.length} stalled jobs, resetting to pending`)
      
      for (const job of stalledJobs) {
        await db.update(urlAccessibilityAudits)
          .set({
            status: 'pending',
            processingStartedAt: null,
            errorMessage: 'Job was stalled and reset',
            updatedAt: new Date(),
          })
          .where(eq(urlAccessibilityAudits.id, job.id))
      }
    }
  } catch (error) {
    console.error('Error cleaning up stalled jobs:', error)
  }
}

// Process pending jobs (call this periodically)
export async function processPendingJobs(): Promise<void> {
  try {
    // Clean up stalled jobs first
    await cleanupStalledJobs()
    
    // Get pending jobs
    const pendingJobs = await db.select()
      .from(urlAccessibilityAudits)
      .where(eq(urlAccessibilityAudits.status, 'pending'))
      .limit(5) // Process max 5 at a time
    
    for (const job of pendingJobs) {
      // Skip if already processing
      if (processingJobs.has(job.id)) {
        continue
      }
      
      console.log(`Starting processing for audit: ${job.id}`)
      await queueAudit(job.id)
    }
  } catch (error) {
    console.error('Error processing pending jobs:', error)
  }
}

// Initialize job processor (call this on app start)
export function initializeJobProcessor(): void {
  // Process pending jobs every 30 seconds
  setInterval(async () => {
    await processPendingJobs()
  }, 30000)
  
  // Clean up stalled jobs every 5 minutes
  setInterval(async () => {
    await cleanupStalledJobs()
  }, 5 * 60 * 1000)
  
  console.log('✓ Job processor initialized (database-based)')
}

// Graceful shutdown
export async function closeQueue(): Promise<void> {
  // Wait for all processing jobs to complete (with timeout)
  const pendingJobs = Array.from(processingJobs.values())
  
  if (pendingJobs.length > 0) {
    console.log(`Waiting for ${pendingJobs.length} jobs to complete...`)
    
    try {
      await Promise.race([
        Promise.all(pendingJobs),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Shutdown timeout')), 30000)
        )
      ])
    } catch (error) {
      console.warn('Some jobs did not complete during shutdown:', error)
    }
  }
  
  console.log('✓ Queue shutdown complete')
} 