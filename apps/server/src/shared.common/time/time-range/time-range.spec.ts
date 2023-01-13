import ava from "ava";
import { TimeRange } from "./time-range";

ava("TimeRange.fromString", (t) => {
  const timeRange = TimeRange.fromString("1h-2h");

  t.is(timeRange.from.value, 3600000);
  t.is(timeRange.to.value, 7200000);
});

ava("TimeRange.fromString with single value", (t) => {
  const timeRange = TimeRange.fromString("1h");

  t.is(timeRange.from.value, 3600000);
  t.is(timeRange.to.value, 3600000);
});

ava("TimeRange.fromString with single value and dash", (t) => {
  const timeRange = TimeRange.fromString("1h-");

  t.is(timeRange.from.value, 3600000);
  t.is(timeRange.to.value, 3600000);
});

ava("TimeRange.fromString with invalid value", (t) => {
  t.throws(() => TimeRange.fromString("-"));
});

ava("TimeRange.average", (t) => {
  const timeRange = TimeRange.fromString("1h-2h");

  t.is(timeRange.average, 5400000);
});

ava("TimeRange.toString", (t) => {
  const timeRange = TimeRange.fromString("1h-2h");

  t.is(timeRange.toString(), "1h-2h");
});

ava("TimeRange.toString with single value", (t) => {
  const timeRange = TimeRange.fromString("1h");

  t.is(timeRange.toString(), "1h-1h");
});

ava("TimeRange.toString with single value and dash", (t) => {
  const timeRange = TimeRange.fromString("1h-");

  t.is(timeRange.from.value, 3600000);
  t.is(timeRange.to.value, 3600000);
});
