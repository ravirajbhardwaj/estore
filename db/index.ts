import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const connectionString = process.env.DATABASE_URL as string

if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable')
}

const sql = neon(connectionString)
export const db = drizzle({ client: sql, casing: 'snake_case' })
