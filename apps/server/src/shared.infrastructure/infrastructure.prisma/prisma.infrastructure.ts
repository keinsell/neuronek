import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.$connect();

export { prisma };
