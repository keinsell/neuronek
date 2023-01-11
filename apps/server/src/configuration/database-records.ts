import { PrismaClient, Prisma, User as _User } from "@prisma/client";

export namespace DatabaseRecords {
  export type CreateUser = {} & Prisma.UserCreateInput;
  export type User = {} & _User;
}
