import { ICommandHandler } from "../../../../common/lib/domain/command";
import { ApplicationError } from "../../../../common/lib/domain/error";
import { Ingestion } from "../../entity";
import { IngestionRepository } from "../../repository";
import { SubstanceNotFoundError } from "../../../substance/errors/substance-not-found";
import { SubstanceRepository } from "../../../substance/repository";
import { IngestSubstanceCommand } from "./command";
import { IngestedSubstanceResponseDTO } from "./response";
import { MassUnit } from "../../../../utilities/mass.vo";

export class IngestSubstanceCommandHandler
	implements ICommandHandler<IngestSubstanceCommand>
{
	constructor(
		private substanceRepository: SubstanceRepository = new SubstanceRepository(),
		private ingestionRepository: IngestionRepository = new IngestionRepository()
	) {}

	async execute(
		command: IngestSubstanceCommand
	): Promise<IngestedSubstanceResponseDTO | ApplicationError> {
		const request = command.request;
		const user = command.user;
		const { amount, purity, ingestedAt, route } = request;
		const substanceName = request.substance;

		const isSubstanceInDatabase =
			await this.substanceRepository.findByNameOrAlias(substanceName);

		if (!isSubstanceInDatabase) {
			return new SubstanceNotFoundError(
				`Substance ${substanceName} not found.`
			);
		}

		const substance = isSubstanceInDatabase;

		// Check if substance have selected route of administration
		if (
			!substance.administrationBy
				.map((roa) => roa.classification)
				.includes(route)
		) {
			return new ApplicationError(
				`Substance ${substance.name} does not have ${route} as a route of administration.`
			);
		}

		// Parse dosage from string to numbers

		const dosage = MassUnit.fromString(amount).baseScalar * (purity ?? 1);

		let ingestion = new Ingestion({
			substance,
			user,
			route,
			amount: MassUnit.fromBase(dosage),
			purity,
			date: ingestedAt,
		});

		ingestion = await this.ingestionRepository.save(ingestion);

		return {
			substance: ingestion.substance.name,
			dosage: ingestion.amount.toString(),
			dateOfIngestion: ingestion.date,
			dosageClassification: ingestion.dosageClassification,
			routeOfAdministration: ingestion.route,
		};
	}
}
