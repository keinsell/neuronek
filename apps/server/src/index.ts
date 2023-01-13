import "reflect-metadata";
import { createUser } from "./feature.create-user/create-user.service.js";
import { loginUser } from "./feature.login-user/login-user.service.js";
import { nanoid } from "nanoid";
import { findSubstanceWithPsychonautWiki } from "./feature.get-substance/service.find-with-psychonautwiki/find-with-psychonautwiki.service.js";

const username = nanoid();

const user = await createUser({
  username: username,
  password: "test",
});

console.log(user);

const loggedInUser = await loginUser({
  username: username,
  password: "test",
});

console.log(loggedInUser);

await findSubstanceWithPsychonautWiki("Caffeine");
