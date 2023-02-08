import { PrismaClient } from '@prisma/client'
export { EffectRepository } from './context.effect/effect.repository.js'

// declare global {
// 	var prisma: PrismaClient | undefined
// }

// export const prisma = global.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export { PrismaClient }
