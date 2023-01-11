import { Hasher, Argon2Hasher } from "@internal/common";
// eslint-disable-next-line node/no-extraneous-import
import { ContainerBuilder } from "diod";

const builder = new ContainerBuilder();

builder.register(Hasher).useInstance(new Argon2Hasher());

const Container = builder.build();

export { Container };
