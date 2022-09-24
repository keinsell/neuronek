import ms from "ms";
import { Entity } from "../../../common/entity/entity.common";
import { Ingestion } from "../../ingestion/entities/ingestion.entity";
import { RouteOfAdministrationType } from "../../substances/route-of-administration/entities/route-of-administration.entity";
import { PsychoactiveClass } from "../../substances/substance/entities/psychoactive-class.enum";
import { User } from "../../user/entities/user.entity";

export type JournalFilter = {
	substance?: string;
	route?: RouteOfAdministrationType;
	psychoactiveClass?: PsychoactiveClass;
	timeSince?: number;
};

// TODO: Dumb fuck, please refactor these fucking array filters because my eyes are bleeding, some external library would be nice to somehow pipe this crap. I mean it works but it can be done better I think.

export interface JournalProperties {
	ingestions: Ingestion[];
	owner: User;
	filters?: JournalFilter;
}

export class Journal extends Entity implements JournalProperties {
	ingestions: Ingestion[];
	filters?: JournalFilter;
	owner: User;

	constructor(properties: JournalProperties, id?: string | number) {
		super(id);
		this.ingestions = properties.ingestions;
		this.filters = properties.filters;
		this.owner = properties.owner;
	}

	getIngestedSubstances() {
		const substances = this.ingestions.map((v) => v.substance);
		// Remove duplicates by substance name
		const uniqueSubstances = substances.filter(
			(v, index, a) => a.findIndex((t) => t.name === v.name) === index,
		);

		return uniqueSubstances;
	}

	getActiveIngestions() {
		const activeIngestions = this.ingestions.filter((v) => v.isActive());
		return activeIngestions;
	}

	getProgressionOfActiveIngestions() {
		const activeIngestions = this.getActiveIngestions();

		const progression = activeIngestions.map(
			(v) => v.getIngestionProgression(),
		);

		progression.map((v) => {
			console.info(
				`S: ${v?.substance} - P: ${v?.progress} - ST: ${v?.stage} - TL: ${v?.timeLeft}`,
			);
		});

		return progression;
	}

	filterIngestions(filers: JournalFilter) {
		const { substance, route, psychoactiveClass, timeSince } = filers;

		const ingestions = this.ingestions.filter((v) => {
			if (substance && v.substance.name !== substance) {
				return false;
			}
			if (route && v.route !== route) {
				return false;
			}

			// Something is wrong with this filter, it doesn't work as intended.
			if (
				psychoactiveClass &&
				!v.substance.classMembership.psychoactiveClass.includes(
					psychoactiveClass,
				)
			) {
				return false;
			}

			if (timeSince && v.getTimeSinceIngestion() > timeSince) {
				return false;
			}
			return true;
		});

		return new Journal({ ingestions, owner: this.owner, filters: filers });
	}

	/** Get average dosage of ingestions. */
	getAverageDosage() {
		const totalDosage = this.ingestions.reduce(
			(a, v) => a + v.getIngestionDosage().dosage,
			0,
		);
		const averageDosage = totalDosage / this.ingestions.length;
		return averageDosage;
	}

	getSumDosage() {
		const totalDosage = this.ingestions.reduce(
			(a, v) => a + v.getIngestionDosage().dosage,
			0,
		);
		return totalDosage;
	}

	/** Get average time between ingestions. */
	getAverageTimeBetween() {
		// Sort ingestions by date, oldest first.
		const ingestions = this.ingestions.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);

		/** Collected times between ingestions. */
		const timeBetweenIngestions = ingestions.map((v, i, a) => {
			if (i === 0) {
				return 0;
			}

			// CHECK: Explict type checking, I think there we may get error when array will be equal to one.
			return (
				(a[i] as Ingestion).date.getTime() -
				(a[i - 1] as Ingestion).date.getTime()
			);
		});

		/** Average value of times collected from Ingestions. */
		const averageTimeBetweenIngestions =
			timeBetweenIngestions.reduce((a, v) => a + v, 0) /
			timeBetweenIngestions.length;

		console.info(
			`Analysed ${this.ingestions.length} ingestions of ${
				(this.ingestions[0] as Ingestion).substance.name
			}. - Average time between dosages: ${ms(averageTimeBetweenIngestions)}`,
		);

		return averageTimeBetweenIngestions;
	}

	/** Get time since last ingestion. */
	getTimeSinceLast() {
		const ingestions = this.ingestions.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
		const lastIngestion = ingestions[ingestions.length - 1];
		const timeSinceLastIngestion = lastIngestion.getTimeSinceIngestion();
		return timeSinceLastIngestion;
	}

	/** Get date of first known ingestion. */
	getDateOfFirstIngestion() {
		const ingestions = this.ingestions.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
		const firstIngestion = ingestions[0];
		return firstIngestion.date;
	}

	/** Get date of last known ingestion. */
	getDateOfLastIngestion() {
		const ingestions = this.ingestions.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);
		const lastIngestion = ingestions[ingestions.length - 1];
		return lastIngestion.date;
	}

	getHighestDosage() {
		const ingestions = this.ingestions.sort(
			(a, b) => a.date.getTime() - b.date.getTime(),
		);

		const highestDosage = ingestions.reduce((a, v) => {
			if (v.dosage > a) {
				return v.getIngestionDosage().dosage;
			}
			return a;
		}, 0);

		console.info(
			`Analysed ${this.ingestions.length} ingestions of ${
				this.ingestions[0].substance.name
			} - Highest dosage: ${highestDosage.toFixed(2)}mg`,
		);

		return highestDosage;
	}

	/** Get average dosage per day since first ingestion. */
	getAverageDosagePerDay() {
		const totalDosage = this.getSumDosage();

		const timeSinceFirstIngestion =
			new Date().getTime() - this.getDateOfFirstIngestion().getTime();

		const timeSinceFirstIngestionInDays = timeSinceFirstIngestion / ms("1d");

		const averageDosagePerDay = totalDosage / timeSinceFirstIngestionInDays;

		if (!this.ingestions[0]) {
			throw new Error("No substance found");
		}

		const { substance } = this.ingestions[0];

		if (!substance) {
			throw new Error("No substance found");
		}

		console.info(
			`Analysed ${this.ingestions.length} ingestions of ${
				this.ingestions[0].substance.name
			} in ${timeSinceFirstIngestionInDays.toFixed(
				2,
			)} days. - Dosage per day: ${averageDosagePerDay.toFixed(
				2,
			)}mg (${substance.getDosageClassification(
				averageDosagePerDay,
				this.ingestions[0].route,
			)})`,
		);

		return averageDosagePerDay;
	}
}
