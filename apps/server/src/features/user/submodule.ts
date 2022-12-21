import { App } from "@tinyhttp/app";
import { RegisterUserController } from "./register-user/controller";
import { LoginUserController } from "./login-user/controller";
import { GetUserProfileController } from "./get-user/controller";
import passport from "passport";

const userModule = new App();

userModule.post(
	"/user/register",
	(request, res) => new RegisterUserController().execute(request as any, res),
);

userModule.post(
	"/user/login",
	(request, res) => new LoginUserController().execute(request as any, res),
);

userModule.get(
	"/user",
	passport.authenticate("jwt", { session: false }),
	(request, res) => new GetUserProfileController().execute(request as any, res),
);

export { userModule };
