import { ICommandHandler } from "../../../../common/lib/domain/command";
import { ILogger } from "../../../../common/lib/infrastructure/logger";
import { IHashingService } from "../../../../common/services/hashing";
import { JsonWebTokenService } from "../../../../common/services/jsonwebtoken";
import { MODULE_CONFIGURATION } from "../../../../configuration/module-configuration";
import { User } from "../../entity";
import { UserMapper } from "../../mapper";
import { UserRepository } from "../../repository";
import { RegisterUserCommand } from "./command";
import { RegisterUserReponseDTO } from "./response";

export class RegisterUserCommandHandler
	implements ICommandHandler<RegisterUserCommand>
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

		const token = this.jsonWebTokenService.sign(
			new UserMapper().toJsonWebToken(user)
		);

		this.logger.log("Token generated", token);

		return {
			id: user.id,
			username: user.username,
			recoveryKey: unashedRecoveryKey,
			token,
		};
	}
}
