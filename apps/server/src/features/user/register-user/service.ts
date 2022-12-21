import { ICommandHandler } from "../../../common/lib/domain/command";
import { ILogger } from "../../../common/lib/infrastructure/logger";
import { IHashingService } from "../../../common/services/hashing";
import { MODULE_CONFIGURATION } from "../../../configuration/module-configuration";
import { User } from "../../../modules/user-v2/entity";
import { UserRepository } from "../../../modules/user-v2/repository";
import { RegisterUserCommand } from "./command";
import { RegisterUserReponseDTO } from "./response";

export class RegisterUserCommandHandler
	implements ICommandHandler<RegisterUserCommand>
{
	constructor(
		private logger: ILogger = MODULE_CONFIGURATION.logger,
		private userRepository: UserRepository = new UserRepository(),
		private hasherService: IHashingService = MODULE_CONFIGURATION.hasher
	) {
		this.logger = logger;
		this.userRepository = userRepository;
		this.hasherService = hasherService;
	}

	async execute(
		command: RegisterUserCommand
	): Promise<RegisterUserReponseDTO> {
		this.logger.log("RegisterUserCommandHandler.execute", command);

		let user = User.generateUser();

		this.logger.log("User generated", user);

		const unashedRecoveryKey = user.recoveryKey;

		user.recoveryKey = await this.hasherService.hash(user.recoveryKey);

		this.logger.log("Hashed recovery key", {
			from: unashedRecoveryKey,
			to: user.recoveryKey,
		});

		try {
			user = await this.userRepository.save(user);
			this.logger.log("User saved", user);
		} catch (e) {
			this.logger.error("Error saving user", e);
		}

		return {
			username: user.username,
			recoveryKey: unashedRecoveryKey,
		};
	}
}
