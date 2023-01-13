import test from "ava";
import { MassRange } from "./mass-range";

test("MassRange.fromString", (t) => {
  const range = MassRange.fromString("1mg-2mg");
  t.is(range.from.baseScalar, 0.000001);
  t.is(range.to.baseScalar, 0.000002);
});

test("MassRange.toString", (t) => {
  const range = new MassRange(
    MassRange.fromString("1mg").from,
    MassRange.fromString("2mg").to
  );
  t.is(range.toString(), "1mg-2mg");
});
