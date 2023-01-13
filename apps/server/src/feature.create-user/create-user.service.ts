import { prisma } from "../shared.infrastructure/infrastructure.prisma/prisma.infrastructure.js";
import { createHash } from "./service.create-hash/create-hash.service.js";
import { User } from "@prisma/client";

interface CreateUserRequest {
  username: string;
  password: string;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  const hashedPassword = await createHash(payload.password);

  return await prisma.user.create({
    data: {
      username: payload.username,
      password: hashedPassword,
    },
  });
}
