import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../shared.configuration/main.configuration.js";

export async function verifyJwt(token: string): Promise<boolean> {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}
