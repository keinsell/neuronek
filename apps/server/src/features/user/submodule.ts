import { App } from "@tinyhttp/app";
import { RegisterUserController } from "./register-user/controller";
import { LoginUserController } from "./login-user/controller";
import { GetUserProfileController } from "./get-user/controller";
import passport from "passport";

const userModule = new App();

userModule.post("/user/register", (req, res) =>
	new RegisterUserController().execute(req as any, res)
);

userModule.post("/user/login", (req, res) =>
	new LoginUserController().execute(req as any, res)
);

userModule.get(
	"/user",
	passport.authenticate("jwt", { session: false }),
	(req, res) => new GetUserProfileController().execute(req as any, res)
);

export { userModule };
