import { RegisterUserDTO } from "../dtos/register-user.dto";
import { UserCreatedEvent } from "../events/user-created.event.js";
import { userMapper } from "../mappers/user.mapper";
import { userRepository } from "../repositories/user.repository";

export class UserService {
	repository = userRepository;
	mapper = userMapper;

	async registerUser(input: RegisterUserDTO): Promise<string> {
		const userEntity = await this.mapper.fromRegisterUserDTO(input);
		const user = await this.repository.save(userEntity);

		new UserCreatedEvent(user);

		return String(user.id);
	}

	async checkIfUsernameExists(username: string): Promise<boolean> {
		const user = await this.repository.findByUsername(username);
		return !!user;
	}
}
