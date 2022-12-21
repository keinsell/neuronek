import { Body, Example, OperationId, Post, Response, Route, Tags } from "tsoa";
import { RegisterUserCommand } from "./command";
import { RegisterUserReponseDTO } from "./response";
import { RegisterUserCommandHandler } from "./service";
import { Controller } from "../../../common/lib/application/controller";

@Tags("User")
@Route("user")
export class RegisterUserController extends Controller {
	protected handler = new RegisterUserCommandHandler();

	@Post("register")
	@OperationId("register-user")
	@Response<RegisterUserReponseDTO>(200, "OK", {
		username: "9m1r1r1r1r1r1r1r",
		recoveryKey: "9m1r1r1r1r1r1r1r9m1r1r1r1r1r1r1r",
	})
	@Example<RegisterUserReponseDTO>({
		username: "9m1r1r1r1r1r1r1r",
		recoveryKey: "9m1r1r1r1r1r1r1r9m1r1r1r1r1r1r1r",
	})
	/**
	 * Generates a new user that can interact with the system.
	 */
	protected async documentation(): Promise<RegisterUserReponseDTO> {
		throw new Error("Method not implemented.");
	}

	protected async executeImplementation(): Promise<unknown> {
		const command = new RegisterUserCommand({});

		const response = await this.handler.execute(command);

		return this.res.status(200).json(response);
	}
}
