import { Usecase } from "../../../../common/usecase/usecase.common";
import { RegisterUserDTO } from "../../dtos/register-user.dto";
import { UserService } from "../../services/user.service.js";

export class RegisterUserUsecase extends Usecase<RegisterUserDTO, string> {
	protected service = new UserService();
	async execute(input: RegisterUserDTO): Promise<string> {
		const userExists = await this.service.checkIfUsernameExists(input.username);

		if (userExists) {
			throw new Error("User already exists");
		}

		return await this.service.registerUser(input);
	}
}
