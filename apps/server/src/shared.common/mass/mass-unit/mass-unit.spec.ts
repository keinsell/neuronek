import ava from "ava";
import { MassUnit } from "./mass-unit";

ava("MassUnit.fromString", (t) => {
  const unit = MassUnit.fromString("1kg");
  t.is(unit.baseScalar, 1);
});

ava("MassUnit.fromBase", (t) => {
  const unit = MassUnit.fromBase(1);
  t.is(unit.baseScalar, 1);
});

ava("MassUnit.toString", (t) => {
  const unit = MassUnit.fromString("1kg");
  t.is(unit.toString(), "1kg");
});

ava("MassUnit (kg)", (t) => {
  const unit = MassUnit.fromString("1kg");
  t.is(unit.baseScalar, 1);
  t.is(unit.toString(), "1kg");
});

ava("MassUnit (g)", (t) => {
  const unit = MassUnit.fromString("1g");
  t.is(unit.baseScalar, 0.001);
  t.is(unit.toString(), "1g");
});

ava("MassUnit (mgs)", (t) => {
  const unit = MassUnit.fromString("1mg");
  t.is(unit.baseScalar, 0.000001);
  t.is(unit.toString(), "1mg");
});

ava("MassUnit (ug)", (t) => {
  const unit = MassUnit.fromString("1ug");
  t.is(unit.baseScalar, 0.000000001);
  t.is(unit.toString(), "1ug");
});
