import { Argon2Hasher } from "@internal/common";
import ava from "ava";
import { Password } from "./password.vo.js";

ava(
  "Password.fromPlain should throw an error if the password is too weak",
  async (t) => {
    const password = "password";
    const hasher = new Argon2Hasher();
    await t.throwsAsync(Password.fromPlain(password, hasher));
  }
);

ava("Password.fromPlain should create a new password", async (t) => {
  const password = "khjkjasfdsadfsdf";
  const hasher = new Argon2Hasher();
  const passwordVO = await Password.fromPlain(password, hasher);
  t.true(await passwordVO.compare(password));
  t.false(await passwordVO.compare("wrong password"));
});
