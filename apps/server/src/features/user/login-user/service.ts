import { ICommandHandler } from "../../../common/lib/domain/command";
import { ApplicationError } from "../../../common/lib/domain/error";
import { ILogger } from "../../../common/lib/infrastructure/logger";
import { IHashingService } from "../../../common/services/hashing";
import { JsonWebTokenService } from "../../../common/services/jsonwebtoken";
import { MODULE_CONFIGURATION } from "../../../configuration/module-configuration";
import { User } from "../../../modules/user-v2/entity";
import { UserMapper } from "../../../modules/user-v2/mapper";
import { UserRepository } from "../../../modules/user-v2/repository";
import { LoginUserCommand, RegisterUserCommand } from "./command";
import { UserInvalidRecoveryKeyError } from "./errors/user-invalid-recovery-key";
import { UserNotFoundError } from "./errors/user-not-found";
import { LoginUserResponseDTO, RegisterUserReponseDTO } from "./response";

export class LoginUserCommandHandler
	implements ICommandHandler<LoginUserCommand>
{
	constructor(
		private logger: ILogger = MODULE_CONFIGURATION.logger,
		private userRepository: UserRepository = new UserRepository(),
		private hasherService: IHashingService = MODULE_CONFIGURATION.hasher,
		private jsonWebTokenService: JsonWebTokenService = new JsonWebTokenService()
	) {
		this.logger = logger;
		this.userRepository = userRepository;
		this.hasherService = hasherService;
		this.jsonWebTokenService = jsonWebTokenService;
	}

	async execute(
		command: LoginUserCommand
	): Promise<LoginUserResponseDTO | ApplicationError> {
		this.logger.log("LoginUserCommandHandler.execute", command);

		const isUserWithProvidedUsername =
			await this.userRepository.findByUsername(command.username);

		console.log(isUserWithProvidedUsername);

		if (!isUserWithProvidedUsername) {
			return new UserNotFoundError();
		}

		const isRecoveryKeyValid = await this.hasherService.verify(
			command.recoveryKey,
			isUserWithProvidedUsername.recoveryKey
		);

		if (!isRecoveryKeyValid) {
			return new UserInvalidRecoveryKeyError();
		}

		const user = isUserWithProvidedUsername;

		const token = this.jsonWebTokenService.sign(
			new UserMapper().toJsonWebToken(user)
		);

		this.logger.log("Token generated", token);

		return {
			id: user.id,
			username: user.username,
			weight: user.weight,
			height: user.height,
			token,
		};
	}
}
