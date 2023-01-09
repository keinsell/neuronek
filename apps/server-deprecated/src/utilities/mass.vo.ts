import Qty from "js-quantities";
import unitmath from "unitmath";

export class MassUnit {
	private v: number;

	constructor(baseScalar: number) {
		this.v = baseScalar;
	}

	static fromString(str: string): MassUnit {
		return new MassUnit(Qty(str).toBase().baseScalar);
	}

	static fromBase(baseScalar: number): MassUnit {
		return new MassUnit(baseScalar);
	}

	public toString(): string {
		const qty = `${Qty(this.v).toString()}kg`;
		const simplified = unitmath(qty).simplify();
		const parsed = simplified.toString();
		return parsed;
	}

	get baseScalar(): number {
		const qty = Qty(this.v);
		const baseScalar = qty.toBase().baseScalar;
		return baseScalar;
	}
}
