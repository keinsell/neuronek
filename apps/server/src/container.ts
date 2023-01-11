import { Hasher, Argon2Hasher } from "@internal/common";
// eslint-disable-next-line node/no-extraneous-import
import { ContainerBuilder } from "diod";
import { UserRepository } from "./modules/user/user.repository.js";
import { RegisterUserService } from "./modules/user/commands/register-user/register-user.service.js";

const builder = new ContainerBuilder();

builder.register(Hasher).useInstance(new Argon2Hasher());

builder.registerAndUse(UserRepository);

builder.registerAndUse(RegisterUserService);

const Container = builder.build();

export { Container };
