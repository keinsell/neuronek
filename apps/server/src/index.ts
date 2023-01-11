import "reflect-metadata";

import { Container } from "./container.js";
import { RegisterUserService } from "./modules/user/commands/register-user/register-user.service.js";
import { RegisterUserCommand } from "./modules/user/commands/register-user/register-user.command.js";
import { UserMapper } from "./modules/user/user.mapper.js";
import { User } from "./modules/user/user.entity.js";
import { Password } from "./modules/user/value-objects/password/password.vo.js";
import { Hasher } from "@internal/common";

const response = await Container.get(RegisterUserService).execute(
  new RegisterUserCommand({ username: "adssad", password: "asdasd" })
);

if (response.isOk()) {
  console.log(response.value);
} else {
  console.log(response.error);
}

const userMapper = Container.get(UserMapper);

console.log(
  userMapper.toPersistence(
    new User({
      username: "adsadfsd",
      password: await Password.fromPlain(
        "asddsfgdfsgdfggdsfdsg",
        Container.get(Hasher)
      ),
    })
  )
);
