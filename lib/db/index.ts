import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import postgres from 'postgres'

// Database connection configuration
const DB_CONNECTION_RETRIES = 5
const DB_CONNECTION_RETRY_DELAY = 5000 // 5 seconds
const DB_CONNECTION_TIMEOUT = 30000 // 30 seconds
const DB_POOL_SIZE = process.env.NODE_ENV === 'production' ? 20 : 5

// Connection options with proper pooling and timeouts
const connectionOptions = {
  prepare: false, // Disable prefetch as it's not supported for "Transaction" pool mode
  max: DB_POOL_SIZE, // Connection pool size
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: DB_CONNECTION_TIMEOUT,
  max_lifetime: 60 * 30, // Max connection lifetime of 30 minutes
  max_pipeline: 1000, // Maximum number of queued queries
}

// Create database client with retry logic
async function createDatabaseClient() {
  for (let attempt = 1; attempt <= DB_CONNECTION_RETRIES; attempt++) {
    try {
      const client = postgres(process.env.DATABASE_URL!, connectionOptions)
      
      // Test the connection
      await client`SELECT 1`
      console.log('✓ Database connection established')
      return client
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error)
      
      if (attempt === DB_CONNECTION_RETRIES) {
        throw new Error('Failed to establish database connection after multiple retries')
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, DB_CONNECTION_RETRY_DELAY))
    }
  }
  
  throw new Error('Failed to establish database connection') // Shouldn't reach here
}

// Initialize database client
let client: ReturnType<typeof postgres>

export async function initializeDatabase() {
  client = await createDatabaseClient()
  return drizzle(client, { schema })
}

// Get database instance (creates connection if needed)
export async function getDatabase() {
  if (!client) {
    return await initializeDatabase()
  }
  return drizzle(client, { schema })
}

// Export the database instance for direct use
export const db = drizzle(postgres(process.env.DATABASE_URL!, connectionOptions), { schema })

// Graceful shutdown
export async function closeDatabase() {
  if (client) {
    console.log('Closing database connections...')
    await client.end()
    client = undefined as any
  }
}

export * from './schema' 