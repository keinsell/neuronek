import { App } from "@tinyhttp/app";
import { RegisterUserController } from "./register-user/controller";
import { ApplicationRequestContext } from "../../common/lib/application/context/request-context";

const userModule = new App();

userModule.post("/user/register", (req, res) =>
	new RegisterUserController().execute(req as any, res)
);

export { userModule };
