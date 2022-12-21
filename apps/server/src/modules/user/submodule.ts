import { App } from "@tinyhttp/app";
import { RegisterUserController } from "./features/register-user/controller";
import { LoginUserController } from "./features/login-user/controller";
import { GetUserProfileController } from "./features/get-user/controller";
import passport from "passport";

const userModule = new App();

userModule.post("/user/register", (request, res) =>
	new RegisterUserController().execute(request as any, res)
);

userModule.post("/user/login", (request, res) =>
	new LoginUserController().execute(request as any, res)
);

userModule.get(
	"/user",
	passport.authenticate("jwt", { session: false }),
	(request, res) =>
		new GetUserProfileController().execute(request as any, res)
);

export { userModule };
