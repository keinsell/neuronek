import { Body, Example, OperationId, Post, Response, Route, Tags } from "tsoa";
import { LoginUserCommand, RegisterUserCommand } from "./command";
import { LoginUserResponseDTO, RegisterUserReponseDTO } from "./response";
import { LoginUserCommandHandler, RegisterUserCommandHandler } from "./service";
import { Controller } from "../../../common/lib/application/controller";
import { LoginUserRequestDTO } from "./request";
import { ApplicationErrorDTO } from "../../../common/lib/domain/error/applicationErrorDTO";
import { ValidationError } from "../../../common/lib/domain/error/validation-error";

@Tags("User")
@Route("user")
export class LoginUserController extends Controller {
	protected handler = new LoginUserCommandHandler();

	@Post("login")
	@OperationId("login-user")
	@Response<LoginUserResponseDTO>(200, "OK", {
		id: "clbxb2x0s0002pod51nbk1uob",
		username: "T51GPDba7qwEnu73",
		// trunk-ignore(semgrep/generic.secrets.security.detected-jwt-token.detected-jwt-token)
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsYnhhejRuMDAxMDY3Z2Q1ejVjcXhuNjMiLCJ1c2VybmFtZSI6IlQ1MUdQRGJhN3F3RW51NzMiLCJpYXQiOjE2NzE2MDU4NzB9.9MblyhSFdtIlsGvz21OqEQGjx9fA7FC1dwsQL73rGZM",
	})
	@Response<ApplicationErrorDTO>(400, "Bad Request", {
		code: 400,
		message: "Bad Request",
		name: "BadRequestError",
	})
	@Example<LoginUserResponseDTO>({
		id: "clbxb2x0s0002pod51nbk1uob",
		username: "T51GPDba7qwEnu73",
		// trunk-ignore(semgrep/generic.secrets.security.detected-jwt-token.detected-jwt-token)
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsYnhhejRuMDAxMDY3Z2Q1ejVjcXhuNjMiLCJ1c2VybmFtZSI6IlQ1MUdQRGJhN3F3RW51NzMiLCJpYXQiOjE2NzE2MDU4NzB9.9MblyhSFdtIlsGvz21OqEQGjx9fA7FC1dwsQL73rGZM",
	})
	/**
	 * Generates a new user that can interact with the system.
	 */
	protected async documentation(
		@Body() _body: LoginUserRequestDTO
	): Promise<LoginUserResponseDTO> {
		throw new Error("Method not implemented.");
	}

	protected async executeImplementation(): Promise<unknown> {
		if (!this.req.body) {
			return this.res
				.status(400)
				.json(new ValidationError("Missing body").toJSON());
		}

		if (!(this.req.body.username && this.req.body.recoveryKey)) {
			return this.res
				.status(400)
				.json(
					new ValidationError(
						"Missing username or recoveryKey"
					).toJSON()
				);
		}

		const command = new LoginUserCommand({
			username: this.req.body.username,
			recoveryKey: this.req.body.recoveryKey,
		});

		const response = await this.handler.execute(command);

		return this.res.status(200).json(response);
	}
}
