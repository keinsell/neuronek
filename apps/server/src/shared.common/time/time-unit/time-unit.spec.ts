import ava from "ava";
import { TimeUnit } from "./time-unit";

ava("TimeUnit.fromString", (t) => {
  const timeUnit = TimeUnit.fromString("1h");

  t.is(timeUnit.value, 3600000);
});

ava("TimeUnit.toString", (t) => {
  const timeUnit = new TimeUnit(3600000);

  t.is(timeUnit.toString(), "1h");
});

ava("TimeUnit.toString with invalid value", (t) => {
  t.throws(() => TimeUnit.fromString("-"));
});
