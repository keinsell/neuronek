import { JsonWebTokenPayload } from "../../authentication-strategy";
import { UserProfileResponseDTO } from "../get-user/response";

export interface RegisterUserReponseDTO extends JsonWebTokenPayload {
	/** RecoveryKey is necessary key to interact with user account. */
	recoveryKey: string;
	/** JsonWebToken */
	token: string;
}
