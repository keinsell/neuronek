import argon2 from "argon2";
import { Hasher } from "../index.js";

export class Argon2Hasher implements Hasher {
  private readonly options: argon2.Options;

  constructor(options?: argon2.Options) {
    this.options = options ?? {};
  }

  public async hash(password: string): Promise<string> {
    return argon2.hash(password, { ...this.options, raw: false });
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password, this.options);
  }

  public async isSupported(hash: string): Promise<boolean> {
    return hash.startsWith("$argon2");
  }
}
