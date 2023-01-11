import { CommandHandler } from "@internal/common";
import { RegisterUserCommand } from "./register-user.command.js";
import { User } from "../../user.entity.js";
import { UserRepository } from "../../user.repository.js";

export class RegisterUserService
  implements CommandHandler<RegisterUserCommand, User>
{
  constructor(private readonly userRepository: UserRepository) {}
  execute(command: RegisterUserCommand): Promise<User> {}
}
