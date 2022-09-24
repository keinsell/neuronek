import { Controller } from "../../../../common/controller/controller.common";
import { RegisterUserBody, RegisterUserRequest } from "./register-user.body.js";
import { RegisterUserUsecase } from "./register-user.usecase.js";
import {
	OperationId,
	Post,
	Route,
	Response,
	Request,
	Body,
	Example,
	Path,
	Tags,
} from "tsoa";
import { User } from "../../dtos/user.dto.js";
import { RegisterUserDTO } from "../../dtos/register-user.dto.js";

@Tags("User")
@Route("user")
export class RegisterUserController extends Controller {
	/**
	 * Create a new user in Neuronek system.
	 *
	 * @param _body
	 */
	@Post("register")
	@OperationId("register-user")
	@Response<string>(
		"201",
		"Created user successfully",
		"cl864jzha0005ted5rfkcrik3"
	)
	@Example<User>({
		id: 1,
		email: "",
		name: "John Doe",
		phoneNumbers: [],
	})
	@Body()
	protected async executeImplementation(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Body() _body: RegisterUserDTO,
	): Promise<any> {
		const validateIncommingBody = RegisterUserBody.validate(this.req.body);

		if (!validateIncommingBody.success) {
			return this.res.status(400).json(validateIncommingBody);
		}

		const createdUser = await new RegisterUserUsecase().execute(
			validateIncommingBody.value,
		);

		if (createdUser.isErr()) {
			return this.res.status(400).json(createdUser.error);
		}

		return this.res.status(201).json(createdUser.value);
	}
}
