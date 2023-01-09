import { Argon2HashingService } from "../common/services/hashing/argon2.hashing";
import { ILogger } from "../common/lib/infrastructure/logger";
import { ConsoleLogger } from "../common/lib/infrastructure/logger/console.logger";
import { IHashingService } from "../common/services/hashing";

export const MODULE_CONFIGURATION: {
	logger: ILogger;
	hasher: IHashingService;
} = {
	logger: new ConsoleLogger(),
	hasher: new Argon2HashingService(),
};
