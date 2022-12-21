import { User } from "../../../../modules/user/entity";

export type ApplicationRequestContext = {
	user?: User;
	requestId: string;
};
