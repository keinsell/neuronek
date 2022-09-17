import { App } from "@tinyhttp/app";
import { RegisterUserController } from "../usecases/register-user/register-user.controller";

const userRouter = new App();

userRouter.get("/user/register", (req, res) => {
  new RegisterUserController().execute(req, res);
});

export { userRouter };
