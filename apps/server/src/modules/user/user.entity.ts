import { Entity } from "@internal/common";
import { Password } from "./value-objects/password/password.vo.js";

export interface UserProperties {
  username: string;
  password: Password;
}

export class User extends Entity<UserProperties> {
  constructor(properties: UserProperties) {
    super(properties);
  }

  // TODO(NEU-34): https://linear.app/keinsell/issue/NEU-34/user-should-contain-username-which-would-be-automatically-generated
  // TODO(NEU-33): https://linear.app/keinsell/issue/NEU-33/user-should-contain-cryptographic-recoverykey-which-would-be-based-on
  public static create(properties: UserProperties): User {
    return new User(properties);
  }

  public get username(): string {
    return this.properties.username;
  }

  public get password(): Password {
    return this.properties.password;
  }
}
