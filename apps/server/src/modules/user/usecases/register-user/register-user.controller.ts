import { Controller } from "../../../../common/controller/controller.common";
import { RegisterUserBody } from "./register-user.body.js";
import { RegisterUserUsecase } from "./register-user.usecase.js";
import { OperationId, Post, Route, Response, Request, Body } from "tsoa";

@Route("user")
export class RegisterUserController extends Controller {
	/** Creates new user */
	@Post("register")
	@OperationId("register-user")
	@Response("201", "Created user successfully")
	protected async executeImplementation(): Promise<any> {
		const validateIncommingBody = RegisterUserBody.validate(this.req.body);

		if (!validateIncommingBody.success) {
			return this.res.status(400).json(validateIncommingBody);
		}

		const createdUser = await new RegisterUserUsecase().execute(
			validateIncommingBody.value
		);

		if (createdUser.isErr()) {
			return this.res.status(400).json(createdUser.error);
		}

		return this.res.status(201).json(createdUser.value);
	}
}
