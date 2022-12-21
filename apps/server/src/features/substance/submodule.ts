import { App } from "@tinyhttp/app";
import { RegisterUserController } from "./register-user/controller";
import { ApplicationRequestContext } from "../../common/lib/application/context/request-context";

const substanceModule = new App();

export { substanceModule };
