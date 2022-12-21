import { JsonWebTokenPayload } from "../../../modules/user-v2/authentication-strategy";

export interface UserProfileResponseDTO extends JsonWebTokenPayload {
	ingestionCount: number;
	token: string;
}
