import ava from "ava";

import { Argon2Hasher } from "./argon2.hasher";

ava("Argon2Hasher", async (t) => {
  const hasher = new Argon2Hasher();

  const password = "password";
  const hash = await hasher.hash(password);
  t.true(await hasher.isSupported(hash));
  t.true(await hasher.compare(password, hash));
});

ava("Argon2Hasher with options", async (t) => {
  const hasher = new Argon2Hasher({ type: 2 });

  const password = "password";
  const hash = await hasher.hash(password);
  t.true(await hasher.isSupported(hash));
  t.true(await hasher.compare(password, hash));
});
