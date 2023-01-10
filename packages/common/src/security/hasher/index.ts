/** Service used for password hashing. */
export abstract class Hasher {
  /**
   * Hashes a password.
   *
   * @param password The password to hash.
   * @returns The hashed password.
   */
  public abstract hash(password: string): Promise<string>;

  /**
   * Compares a password with a hash.
   * @param password The password to compare.
   * @param hash The hash to compare.
   * @returns True if the password matches the hash, false otherwise.
   * @throws {Error} If the hash is invalid.
   * @throws {Error} If the hash is not supported.
   * @throws {Error} If the hash is not a string.
   */
  public abstract compare(password: string, hash: string): Promise<boolean>;

  /**
   * Checks if a hash is supported.
   * @param hash The hash to check.
   * @returns True if the hash is supported, false otherwise.
   * @throws {Error} If the hash is invalid.
   */
  public abstract isSupported(hash: string): Promise<boolean>;
}
