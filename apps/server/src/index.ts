import "reflect-metadata";
import { createUser } from "./feature.create-user/create-user.service.js";

const user = await createUser({
  username: "test",
  password: "test",
});

console.log(user);
