import { TimeUnit } from "../time-unit/time-unit.js";

export class TimeRange {
  constructor(public from: TimeUnit, public to: TimeUnit) {}

  get average(): number {
    return (this.from.value + this.to.value) / 2;
  }

  toString(): string {
    return `${this.from.toString()}-${this.to.toString()}`;
  }

  static fromString(time: string): TimeRange {
    const [from, to] = time.split("-");

    if (!from && !to) {
      throw new Error("Invalid time range");
    }

    if (!from) {
      return new TimeRange(TimeUnit.fromString(to!), TimeUnit.fromString(to!));
    }

    if (!to) {
      return new TimeRange(
        TimeUnit.fromString(from),
        TimeUnit.fromString(from)
      );
    }

    return new TimeRange(TimeUnit.fromString(from), TimeUnit.fromString(to));
  }
}
