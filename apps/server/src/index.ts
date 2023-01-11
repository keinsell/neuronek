import "reflect-metadata";

import { Container } from "./container.js";
import { RegisterUserService } from "./modules/user/commands/register-user/register-user.service.js";
import { RegisterUserCommand } from "./modules/user/commands/register-user/register-user.command.js";

const response = await Container.get(RegisterUserService).execute(
  new RegisterUserCommand({ username: "adssad", password: "asdasd" })
);

if (response.isOk()) {
  console.log(response.value);
} else {
  console.log(response.error);
}
