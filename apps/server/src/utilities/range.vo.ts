import ms from "ms";

export class NumberRange {
	constructor(public min?: number, public max?: number) {}
	public static fromString(str: string): NumberRange {
		const [min, max] = str.split("-");
		return new NumberRange(Number(min), Number(max));
	}

	public toString(): string {
		return `${this.min}-${this.max}`;
	}
}

export class TimeRange {
	constructor(public min?: number, public max?: number) {}
	public static fromString(str: string): TimeRange {
		let [min, max] = str.split("-");

		if (!(min && max)) {
			throw new Error("Invalid range");
		}

		return new TimeRange(ms(min), ms(max));
	}

	public toString(): string {
		if (!(this.min && this.max)) {
			throw new Error("Invalid range");
		}

		return `${ms(this.min)}-${ms(this.max)}`;
	}
}
