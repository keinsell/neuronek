import ava from "ava";
import { Password } from "./password.vo.js";
import { Argon2Hasher } from "@internal/common";

ava("Password.fromPlain", async (t) => {
  const password = await Password.fromPlain("password", new Argon2Hasher());
  t.true(await password.compare("password"));
  t.false(await password.compare("password1"));
});

ava("Password.fromHash", async (t) => {
  const password = await Password.fromHash(
    "$argon2id$v=19$m=4096,t=3,p=1$9X5rQ2dD+V8jJ6Zw7V1h3g$3m6U3Q2lQ9J9zY6Yk0cRfQ",
    new Argon2Hasher()
  );
  t.true(await password.compare("password"));
  t.false(await password.compare("password1"));
});
