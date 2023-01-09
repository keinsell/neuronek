import { PrismaClient } from "@prisma/client";

const PrismaInstance = new PrismaClient();

await PrismaInstance.$connect();

export { PrismaInstance };
