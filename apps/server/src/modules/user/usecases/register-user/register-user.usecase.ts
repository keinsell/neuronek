import { Usecase } from "../../../../common/usecase/usecase.common";
import { RegisterUserDTO } from "../../dtos/register-user.dto";
import { UserService } from "../../services/user.service.js";

export class RegisterUserUsecase extends Usecase<RegisterUserDTO, string> {
	async execute(input: RegisterUserDTO): Promise<string> {
		const user = await new UserService().registerUser(input);
		return user;
	}
}
