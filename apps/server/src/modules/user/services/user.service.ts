import { RegisterUserDTO } from "../dtos/register-user.dto";
import { userMapper } from "../mappers/user.mapper";
import { userRepository } from "../repositories/user.repository";

export class UserService {
  repository = userRepository;
  mapper = userMapper;

  async registerUser(input: RegisterUserDTO): Promise<string> {
    const userEntity = this.mapper.fromRegisterUserDTO(input);
    const user = await this.repository.save(userEntity);
    return String(user.id);
  }
}
