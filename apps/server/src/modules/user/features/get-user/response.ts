import { JsonWebTokenPayload } from "../../authentication-strategy";

export interface UserProfileResponseDTO extends JsonWebTokenPayload {
	ingestionCount: number;
	token: string;
}
