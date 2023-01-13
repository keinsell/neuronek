import { createHash } from "../shared.common/hashing/hash.service.js";
import { User } from "../shared.domain/modules/user/user.entity.js";

interface CreateUserRequest {
  username: string;
  password: string;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  const hashedPassword = await createHash(payload.password);

  return {
    username: payload.username,
    password: hashedPassword,
  };
}
