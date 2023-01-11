import { Command, CommandProperties } from "@internal/common";

export class RegisterUserCommand extends Command {
  public readonly username: string;
  public readonly password: string;

  constructor(properties: CommandProperties<RegisterUserCommand>) {
    super(properties);
    this.username = properties.username;
    this.password = properties.password;
  }
}
