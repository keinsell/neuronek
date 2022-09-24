import { Controller } from "../../../../common/controller/controller.common";
import { RegisterUserBody } from "./register-user.body.js";
import { RegisterUserUsecase } from "./register-user.usecase.js";

export class RegisterUserController extends Controller {
	protected async executeImplementation(): Promise<any> {
		const validateIncommingBody = RegisterUserBody.validate(this.req.body);

		if (!validateIncommingBody.success) {
			return this.res.status(400).json(validateIncommingBody);
		}

		const createdUser = await new RegisterUserUsecase().execute(
			validateIncommingBody.value,
		);

		this.ok(this.res, createdUser);
	}
}
