import { Body, Get, OperationId, Post, Route, Security, Tags } from "tsoa";
import { GetUserProfileCommand, IngestSubstanceCommand } from "./command";
import {
	IngestedSubstanceResponseDTO,
	UserProfileResponseDTO,
} from "./response";
import {
	GetUserProfileCommandHandler,
	IngestSubstanceCommandHandler,
} from "./service";
import { Controller } from "../../../../common/lib/application/controller";
import { ApplicationError } from "../../../../common/lib/domain/error";
import { IngestSubstanceRequestDTO } from "./request";

@Tags("Ingestion")
@Route("ingestion")
export class IngestSubstanceController extends Controller {
	protected handler = new IngestSubstanceCommandHandler();

	@Post()
	@OperationId("ingest-substance")
	@Security("jwt", ["user"])
	protected async documentation(
		@Body() _body: IngestSubstanceRequestDTO
	): Promise<IngestedSubstanceResponseDTO> {
		throw new Error("Method not implemented.");
	}

	protected async executeImplementation(): Promise<unknown> {
		if (!this.req.user) {
			return this.unauthorized();
		}

		const command = new IngestSubstanceCommand(
			this.req.body,
			this.req.user
		);

		const response = await this.handler.execute(command);

		if (response instanceof ApplicationError) {
			return this.res.status(500).json(response.toJSON());
		}

		return this.res.status(200).json(response);
	}
}
