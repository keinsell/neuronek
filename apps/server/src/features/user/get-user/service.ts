import { ICommandHandler } from "../../../common/lib/domain/command";
import { ApplicationError } from "../../../common/lib/domain/error";
import { ILogger } from "../../../common/lib/infrastructure/logger";
import { IHashingService } from "../../../common/services/hashing";
import { JsonWebTokenService } from "../../../common/services/jsonwebtoken";
import { MODULE_CONFIGURATION } from "../../../configuration/module-configuration";
import { IngestionRepository } from "../../../modules/ingestion-v2/repository";
import { User } from "../../../modules/user-v2/entity";
import { UserMapper } from "../../../modules/user-v2/mapper";
import { UserRepository } from "../../../modules/user-v2/repository";
import {
	GetUserProfileCommand,
	LoginUserCommand,
	RegisterUserCommand,
} from "./command";
import { UserInvalidRecoveryKeyError } from "./errors/user-invalid-recovery-key";
import { UserNotFoundError } from "./errors/user-not-found";
import {
	LoginUserResponseDTO,
	RegisterUserReponseDTO,
	UserProfileResponseDTO,
} from "./response";

export class GetUserProfileCommandHandler
	implements ICommandHandler<GetUserProfileCommand>
{
	constructor(
		private logger: ILogger = MODULE_CONFIGURATION.logger,
		private userRepository: UserRepository = new UserRepository(),
		private ingestionRepository: IngestionRepository = new IngestionRepository(),
		private jsonWebTokenService: JsonWebTokenService = new JsonWebTokenService()
	) {
		this.logger = logger;
		this.userRepository = userRepository;
		this.jsonWebTokenService = jsonWebTokenService;
		this.ingestionRepository = ingestionRepository;
	}

	async execute(
		command: GetUserProfileCommand
	): Promise<UserProfileResponseDTO | ApplicationError> {
		this.logger.log("LoginUserCommandHandler.execute", command);

		const user = command.user;

		const ingestions =
			await this.ingestionRepository.countAllByIngesterUsername(
				user.username
			);

		const token = this.jsonWebTokenService.sign(
			new UserMapper().toJsonWebToken(user)
		);

		return {
			id: user.id,
			username: user.username,
			weight: user.weight,
			height: user.height,
			ingestionCount: ingestions,
			token,
		};
	}
}
