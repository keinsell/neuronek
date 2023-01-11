import { CommandHandler, Hasher } from "@internal/common";
import { RegisterUserCommand } from "./register-user.command.js";
import { User } from "../../user.entity.js";
import { UserRepository } from "../../user.repository.js";
import { Result, ResultAsync, errAsync, okAsync } from "neverthrow";
import { UserProvidedWeakPasswordException } from "../../exceptions/weak-password.exception.js";
import { Password } from "../../value-objects/password/password.vo.js";
import { Service } from "diod";

@Service()
export class RegisterUserService
  implements
    CommandHandler<
      RegisterUserCommand,
      Result<User, UserProvidedWeakPasswordException>
    >
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher
  ) {}
  async execute(
    command: RegisterUserCommand
  ): Promise<Result<User, UserProvidedWeakPasswordException>> {
    let password: Password;

    try {
      password = await Password.fromPlain(command.password, this.hasher);
    } catch (error) {
      console.log(error);
      return errAsync(new UserProvidedWeakPasswordException());
    }

    const user = User.create({
      username: command.username,
      password,
    });

    okAsync(user);
  }
}
