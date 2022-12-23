import ms from "ms";
import { Ingestion } from "../ingestion/entity";
import { DosageClassification } from "../substance/entities/dosage-classification.enum";
import { PhaseClassification } from "../substance/entities/phase-classification.enum";
import { PsychoactiveClass } from "../substance/entities/psychoactive-class.enum";
import { UserWithIngestions } from "../user/entity";

export class IngestionAnalitics {
	insights: string[] = [];
	constructor(
		private ingestion: Ingestion,
		private userWithIngestions?: UserWithIngestions
	) {
		this.analyse();
	}

	get timeToNoticeableEffects(): number {
		const routeOfAdministration = this.ingestion.route;
		const substance = this.ingestion.substance;

		const substanceRouteOfAdministration = substance.administrationBy.find(
			(route) => route.classification === routeOfAdministration
		);

		if (!substanceRouteOfAdministration) {
			throw new Error(
				`Substance ${substance.name} has no route of administration ${routeOfAdministration}`
			);
		}

		return substanceRouteOfAdministration.getTimeToPhase(
			PhaseClassification.comeup
		);
	}

	/** Calculate time from ingestion to end of peak */
	get ingestionWillPromotePositiveEffectsFor(): number {
		const routeOfAdministration = this.ingestion.route;
		const substance = this.ingestion.substance;

		const substanceRouteOfAdministration = substance.administrationBy.find(
			(route) => route.classification === routeOfAdministration
		);

		if (!substanceRouteOfAdministration) {
			throw new Error(
				`Substance ${substance.name} has no route of administration ${routeOfAdministration}`
			);
		}

		return substanceRouteOfAdministration.getTimeToPhase(
			PhaseClassification.offset
		);
	}

	get ingestionWillPromoteNegativeEffectsFor(): number {
		const routeOfAdministration = this.ingestion.route;
		const substance = this.ingestion.substance;

		const substanceRouteOfAdministration = substance.administrationBy.find(
			(route) => route.classification === routeOfAdministration
		);

		if (!substanceRouteOfAdministration) {
			throw new Error(
				`Substance ${substance.name} has no route of administration ${routeOfAdministration}`
			);
		}

		const aftereffectsDurationWithOffset =
			substanceRouteOfAdministration.duration.offset +
			substanceRouteOfAdministration.duration.aftereffects;

		return aftereffectsDurationWithOffset;
	}

	get ingestionWillPromoteEffectsFor(): number {
		return (
			this.ingestionWillPromotePositiveEffectsFor +
			this.ingestionWillPromoteNegativeEffectsFor
		);
	}

	public addInsight(insight: string) {
		this.insights.push(insight);
	}

	private dosage() {
		// Dosage-related insights
		// Guard against theresholdDosage
		if (
			this.ingestion.dosageClassification ===
			DosageClassification.thereshold
		) {
			const message = `Dosage of ${this.ingestion.purityAdjustedDosage.toString()} is considered to be a thereshold dosage, which may not produce any subjective effects, yet you may feel something.`;

			this.addInsight(message);

			// TODO: Add dopamine-serialization case
			// TODO: Add psychodelic microdose case
			// TODO: Disadvise MDMA microdosing
		}

		if (
			this.ingestion.dosageClassification === DosageClassification.light
		) {
			const message = `Dosage of ${this.ingestion.purityAdjustedDosage.toString()} is considered to be a light dosage, which may produce mild subjective effects - you should be able to ignore them after you will focus on something.`;

			this.addInsight(message);
		}

		if (
			this.ingestion.dosageClassification ===
			DosageClassification.moderate
		) {
			const message = `Dosage of ${this.ingestion.purityAdjustedDosage.toString()} is considered to be a moderate dosage, which may produce moderate subjective effects - you may trouble ignoring them but you should be still able to perform daily tasks.`;

			this.addInsight(message);
		}

		// Guard against stronger dosages
		if (
			this.ingestion.dosageClassification === DosageClassification.strong
		) {
			const message = `Dosage of ${this.ingestion.purityAdjustedDosage.toString()} is considered to be a strong dosage, which may produce strong subjective effects - you may have trouble ignoring them and you may not be able to perform daily tasks, also communication with other people may be problematic.`;

			this.addInsight(message);
		}

		// Guard against very strong dosages
		if (
			this.ingestion.dosageClassification === DosageClassification.heavy
		) {
			const message = `Dosage of ${this.ingestion.purityAdjustedDosage.toString()} is considered to be a heavy dosage, which may produce overwhelming subjective effects at this point effects cannot be ignored, you cannot self-help yourself in case of troubles - you should definitely seek for tripsitter. Communication with other people after such dosages is nearly impossible. These dosages may produce serious (unreversable) health risks and even death.`;

			this.addInsight(message);
		}
	}

	private routeOfAdministration() {
		// TODO: Example: Sniffing cocaine can cause nosebleeds
	}

	private duration() {
		// Add information about duration
		// TODO: This should be relative to ingestion time.
		const message = `Effects of this ingestion will be noticeable after ${ms(
			this.timeToNoticeableEffects,
			{ long: true }
		)} and will last for ${ms(this.ingestionWillPromoteEffectsFor, {
			long: true,
		})}. Where positive effects will last for ${ms(
			this.ingestionWillPromotePositiveEffectsFor,
			{ long: true }
		)} and negative effects will last for ${ms(
			this.ingestionWillPromoteNegativeEffectsFor,
			{ long: true }
		)}.`;

		this.addInsight(message);
	}

	// TODO: We should check past ingestions of specific user, use our "tolerance algorithm" and classify potential abuase of such substance in last two weeks (or even last month) - if user's tolerance algorithm is classifed above light we should warn user about potential abuse.
	private checkAbusePotential() {
		const substance = this.ingestion.substance;
		const psychoactiveGroup = substance.psychoactiveClass;
		const ingestions = this.userWithIngestions?.ingestions;

		if (!ingestions) {
			return;
		}
	}

	public analyse(): void {
		this.dosage();
		this.routeOfAdministration();
		this.duration();

		const isStimulant =
			this.ingestion.substance.psychoactiveClass ===
			PsychoactiveClass.stimulant;

		const doSubstanceEffectsLastMoreThan6h =
			this.ingestion.substance.getTotalDurationOfEffectsRelativeToRouteOfAdministration(
				this.ingestion.route
			) > ms("6h");

		const isNotDepressant =
			this.ingestion.substance.psychoactiveClass !==
			PsychoactiveClass.depressant;

		// Stimulant-oriented insights
		if (
			isStimulant ||
			(doSubstanceEffectsLastMoreThan6h && isNotDepressant)
		) {
			const isCurrentHourAfternoonOrEvening = new Date().getHours() > 14;

			// Avoid distributing sleep pattern
			if (isCurrentHourAfternoonOrEvening) {
				const message = `It's not recommended to ingest stimulants (or other substances that promote wakefullnes effect) afternoon, as they may seriously impact your sleeping pattern. Such ingestion may block your sleep until (or at least) ${new Date(
					Date.now() + this.ingestionWillPromoteEffectsFor
				).toLocaleTimeString()}`;

				this.addInsight(message);
			}
		}
	}
}
