import { Body, Example, OperationId, Post, Response, Route, Tags } from "tsoa";
import { RegisterUserCommand } from "./command";
import { RegisterUserReponseDTO } from "./response";
import { RegisterUserCommandHandler } from "./service";
import { Controller } from "../../../../common/lib/application/controller";

@Tags("User")
@Route("user")
export class RegisterUserController extends Controller {
	protected handler = new RegisterUserCommandHandler();

	@Post("register")
	@OperationId("register-user")
	@Response<RegisterUserReponseDTO>(200, "OK", {
		username: "T51GPDba7qwEnu73",
		recoveryKey: "wESm3711FEGAlba74rGOAYzXtCdzSjdx",
		// trunk-ignore(semgrep/generic.secrets.security.detected-jwt-token.detected-jwt-token)
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsYnhhejRuMDAxMDY3Z2Q1ejVjcXhuNjMiLCJ1c2VybmFtZSI6IlQ1MUdQRGJhN3F3RW51NzMiLCJpYXQiOjE2NzE2MDU4NzB9.9MblyhSFdtIlsGvz21OqEQGjx9fA7FC1dwsQL73rGZM",
	})
	@Example<RegisterUserReponseDTO>({
		username: "T51GPDba7qwEnu73",
		recoveryKey: "wESm3711FEGAlba74rGOAYzXtCdzSjdx",
		// trunk-ignore(semgrep/generic.secrets.security.detected-jwt-token.detected-jwt-token)
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsYnhhejRuMDAxMDY3Z2Q1ejVjcXhuNjMiLCJ1c2VybmFtZSI6IlQ1MUdQRGJhN3F3RW51NzMiLCJpYXQiOjE2NzE2MDU4NzB9.9MblyhSFdtIlsGvz21OqEQGjx9fA7FC1dwsQL73rGZM",
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
