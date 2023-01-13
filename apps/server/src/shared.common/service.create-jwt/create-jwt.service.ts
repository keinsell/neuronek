import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWT_SECRET } from "../../shared.configuration/main.configuration.js";

interface CreateJwtRequest {
  user: User;
}

export function createJwt(payload: CreateJwtRequest): string {
  const { user } = payload;

  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
}
