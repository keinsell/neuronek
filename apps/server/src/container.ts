import { Hasher, Argon2Hasher } from "@internal/common";
import { ContainerBuilder } from "diod";

const builder = new ContainerBuilder();

builder.register(Hasher).useInstance(new Argon2Hasher());

const Container = builder.build();

export { Container };
