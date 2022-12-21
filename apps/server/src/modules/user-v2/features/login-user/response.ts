import { JsonWebTokenPayload } from "../../authentication-strategy";
import { UserProfileResponseDTO } from "../get-user/response";

export interface LoginUserResponseDTO extends JsonWebTokenPayload {
	token: string;
}
