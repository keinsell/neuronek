import ms from "ms";

export class TimeUnit {
  constructor(public value: number) {
    if (!value) throw new Error("Invalid time unit");
  }

  toString(): string {
    return ms(this.value);
  }

  static fromString(time: string): TimeUnit {
    const value = ms(time);
    return new TimeUnit(value);
  }
}
