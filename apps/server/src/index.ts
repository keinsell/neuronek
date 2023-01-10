import { Password } from "./modules/user/value-objects/password/password.vo.js";
import { User } from "./modules/user/user.entity.js";
import { Argon2Hasher } from "@internal/common";

console.log("Hello World!");

console.log(
  User.create({
    username: "test",
    password: await Password.fromPlain("khjkjhgjhkjkhl", new Argon2Hasher()),
  })
);
