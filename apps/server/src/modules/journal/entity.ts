import { Ingestion } from "../ingestion/entity";
import { PsychoactiveClass } from "../substance/entities/psychoactive-class.enum";
import { Substance } from "../substance/entity";
import { User, UserWithIngestions } from "../user/entity";

export class Journal {
	ownedBy: User;
	constructor(public ingestions: Ingestion[], user: User) {
		this.ingestions = ingestions;
		this.ownedBy = user;
	}
	static buildFromUserWithIngestions(
		userWithIngestions: UserWithIngestions
	): Journal {
		return new Journal(userWithIngestions.ingestions, userWithIngestions);
	}

	public filterBy(filter: {
		substance?: Substance[];
		psychoactiveClass?: PsychoactiveClass[];
	}): Journal {
		const filteredIngestions = this.ingestions.filter((ingestion) => {
			if (filter.substance) {
				return filter.substance.includes(ingestion.substance);
			}
			if (filter.psychoactiveClass) {
				return filter.psychoactiveClass.includes(
					ingestion.substance.psychoactiveClass
				);
			}
			return true;
		});
		return new Journal(filteredIngestions, this.ownedBy);
	}

	getSumDosage() {
		return this.ingestions.reduce((a, v) => a + v.purityAdjustedDosage, 0);
	}

	getAverageDosage() {
		const totalDosage = this.getSumDosage();
		return totalDosage / this.ingestionCount;
	}

	getAverageTimeBetweenIngestions() {}
	getTimeSinceLastIngestion() {}
	getDateOfFirstIngestion() {}
	getDateOfLastIngestion() {}
	getHighestDosage() {}
	getLowestDosage() {}
	getAverageDosagePerDay() {}

	get ingestionCount(): number {
		return this.ingestions.length;
	}
}
