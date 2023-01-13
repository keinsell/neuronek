import argon2 from "argon2";

export async function createHash(password: string): Promise<string> {
  return await argon2.hash(password);
}
