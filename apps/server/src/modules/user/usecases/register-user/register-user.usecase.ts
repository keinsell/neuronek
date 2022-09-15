import { Usecase } from "../../../../common/usecase/usecase.common";
import { RegisterUserDTO } from "../../dtos/register-user.dto";

export class RegisterUserUsecase extends Usecase<RegisterUserDTO, string> {
  execute(input: RegisterUserDTO): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
