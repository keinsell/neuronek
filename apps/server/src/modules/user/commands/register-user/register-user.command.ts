import { Command, CommandProperties, MassUnit } from "@internal/common";

export class RegisterUserCommand extends Command {
  public readonly username: string;
  public readonly password: string;
  public readonly birthdate?: Date;
  public readonly weight?: MassUnit;
  public readonly height?: number;

  constructor(properties: CommandProperties<RegisterUserCommand>) {
    super(properties);
    this.username = properties.username;
    this.password = properties.password;
  }
}
