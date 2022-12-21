import { User } from "../../../../modules/user-v2/entity";

export type ApplicationRequestContext = {
	user?: User;
	requestId: string;
};
