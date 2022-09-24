import { Usecase } from "../../../../common/usecase/usecase.common";
import { RegisterUserDTO } from "../../dtos/register-user.dto";
import { UserService } from "../../services/user.service.js";
import { err, ok, Result } from "neverthrow";
import { ApplicationError } from "../../../../common/error/error.common.js";
import { UsernameAlreadyTaken } from "../../errors/username-already-taken.error.js";

// TODO: This should use neverthrow library along with predefined errors in our code, this will ensure safety of software and error throwing.

export class RegisterUserUsecase extends Usecase<
	RegisterUserDTO,
	Result<string, ApplicationError>
> {
	protected service = new UserService();
	async execute(input: RegisterUserDTO) {
		const userExists = await this.service.checkIfUsernameExists(input.username);

		if (userExists) {
			return err(new UsernameAlreadyTaken(input.username));
		}

		return ok(await this.service.registerUser(input));
	}
}
