import { PrismaClient } from '@prisma/client'
export { IngestionRepository } from './repositories/ingestion.repository.js'
export { EffectRepository } from './repositories/effect.repository.js'
export { SubstanceRepository } from './repositories/substance.repository.js'

// declare global {
// 	var prisma: PrismaClient | undefined
// }

// export const prisma = global.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export { PrismaClient }
