import { JsonWebTokenPayload } from "../../../modules/user-v2/authentication-strategy";
import { UserProfileResponseDTO } from "../get-user/response";

export interface LoginUserResponseDTO extends JsonWebTokenPayload {
	token: string;
}
