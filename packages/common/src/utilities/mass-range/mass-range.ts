import { MassUnit } from "../mass-unit/mass-unit.js";

export class MassRange {
  constructor(public from: MassUnit, public to: MassUnit) {}

  get average(): number {
    return (this.from.baseScalar + this.to.baseScalar) / 2;
  }

  toString(): string {
    return `${this.from.toString()}-${this.to.toString()}`;
  }

  static fromString(time: string): MassRange {
    const [from, to] = time.split("-");

    if (!from && !to) {
      throw new Error("Invalid time range");
    }

    if (!from) {
      return new MassRange(MassUnit.fromString(to!), MassUnit.fromString(to!));
    }

    if (!to) {
      return new MassRange(
        MassUnit.fromString(from),
        MassUnit.fromString(from)
      );
    }

    return new MassRange(MassUnit.fromString(from), MassUnit.fromString(to));
  }
}
