import { Entity } from "@internal/common";
import zxcvbn from "zxcvbn";

export interface UserProperties {
  username: string;
  password: string;
}

export class User extends Entity<UserProperties> {
  // TODO(NEU-34): https://linear.app/keinsell/issue/NEU-34/user-should-contain-username-which-would-be-automatically-generated
  // TODO(NEU-33): https://linear.app/keinsell/issue/NEU-33/user-should-contain-cryptographic-recoverykey-which-would-be-based-on
  public static create(properties: UserProperties): User {
    // Check strength of password
    if (zxcvbn(properties.password).score < 3) {
      throw new Error("Password is too weak");
    }

    return new User(properties);
  }
}
