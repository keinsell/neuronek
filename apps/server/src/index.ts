import "reflect-metadata";

import { Password } from "./modules/user/value-objects/password/password.vo.js";
import { User } from "./modules/user/user.entity.js";
import { Container } from "./container.js";
import { Hasher } from "@internal/common";

const user = User.create({
  username: "test",
  password: await Password.fromPlain(
    "asddasasdasddsasad",
    Container.get(Hasher)
  ),
});

console.log(user);
