import ms from "ms";

export class NumberRange {
	constructor(public min?: number, public max?: number) {}
	public static fromString(str: string): NumberRange {
		const [min, max] = str.split("-");
		return new NumberRange(Number(min), Number(max));
	}

	get avg(): number {
		return (this.min! + this.max!) / 2;
	}

	public toString(): string {
		return `${this.min}-${this.max}`;
	}
}

export class TimeRange {
	constructor(public min: number, public max: number) {}
	public static fromString(str: string): TimeRange {
		let [min, max] = str.split("-");

		console.log(min, max);

		if (!max && min) {
			max = min;
		}

		if (!min && max) {
			min = max;
		}

		if (!min && !max) {
			throw new Error("Invalid range");
		}

		return new TimeRange(ms(min!), ms(max!));
	}

	public toString(): string {
		if (!(this.min && this.max)) {
			throw new Error("Invalid range");
		}

		return `${ms(this.min)}-${ms(this.max)}`;
	}

	get avg(): number {
		return (this.min + this.max) / 2;
	}

	add(timeRange: TimeRange): TimeRange {
		if (!(this.min && this.max)) {
			throw new Error("Invalid range");
		}

		return new TimeRange(
			this.min + timeRange.min,
			this.max + timeRange.max
		);
	}
}
