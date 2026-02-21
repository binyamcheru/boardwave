import 'dotenv/config'
import { setDefaultAutoSelectFamily } from 'node:net'
import * as PrismaClientModule from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const { PrismaClient } = PrismaClientModule as any

setDefaultAutoSelectFamily(false)

const databaseUrl = new URL(process.env.DATABASE_URL!)
if (['prefer', 'require', 'verify-ca'].includes(databaseUrl.searchParams.get('sslmode') ?? '')) {
  databaseUrl.searchParams.set('sslmode', 'verify-full')
}

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
})

export const prisma = new PrismaClient({ adapter })