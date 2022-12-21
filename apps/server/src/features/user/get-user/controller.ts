import {
	Body,
	Example,
	Get,
	OperationId,
	Post,
	Response,
	Route,
	Security,
	Tags,
} from "tsoa";
import { GetUserProfileCommand } from "./command";
import { UserProfileResponseDTO } from "./response";
import { GetUserProfileCommandHandler } from "./service";
import { Controller } from "../../../common/lib/application/controller";

@Tags("User")
@Route("user")
export class GetUserProfileController extends Controller {
	protected handler = new GetUserProfileCommandHandler();

	@Get()
	@OperationId("get-user")
	@Security("jwt", ["user"])
	protected async documentation(): Promise<UserProfileResponseDTO> {
		throw new Error("Method not implemented.");
	}

	protected async executeImplementation(): Promise<unknown> {
		if (!this.req.user) {
			return this.unauthorized();
		}

		const command = new GetUserProfileCommand(this.req.user);

		const response = await this.handler.execute(command);

		return this.res.status(200).json(response);
	}
}
