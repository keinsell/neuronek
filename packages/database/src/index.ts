// eslint-disable-next-line node/file-extension-in-import
// import { PrismaClient } from '@prisma/client'

// declare global {
// 	// eslint-disable-next-line no-var
// 	var prisma: PrismaClient | undefined
// }

// export const prisma = global.prisma || new PrismaClient()

export { PrismaClient, Prisma } from '@prisma/client'

// if (process.env['NODE_ENV'] !== 'production') global.prisma = prisma
