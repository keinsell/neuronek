import { ValueObject, Hasher } from "@internal/common";
import zxcvbn from "zxcvbn";

export class Password extends ValueObject<string> {
  constructor(public hash: string, private readonly hasher: Hasher) {
    super(hash);
  }

  public async compare(password: string): Promise<boolean> {
    return this.hasher.compare(password, this.hash);
  }

  public toString(): string {
    return this.hash;
  }

  /**
   * Creates a new password from plain text.
   * @param password The plain text password.
   * @param hasher The hasher to use.
   * @returns The password.
   * @throws {Error} If the password is too weak.
   */
  public static async fromPlain(
    password: string,
    hasher: Hasher
  ): Promise<Password> {
    // Validate strenght of password.
    if (zxcvbn(password).score < 3) {
      throw new Error("Password is too weak");
    }

    const hashedPassword = await hasher.hash(password);
    return new Password(hashedPassword, hasher);
  }

  /**
   *  Creates a new password from a hash.
   * @param hash The hash.
   * @param hasher The hasher to use.
   * @returns The password.
   * @throws {Error} If the hash is invalid.
   */
  public static fromHash(hash: string, hasher: Hasher): Password {
    return new Password(hash, hasher);
  }
}
