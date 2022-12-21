import { ICommandHandler } from "../../../common/lib/domain/command";
import { ApplicationError } from "../../../common/lib/domain/error";
import { Ingestion } from "../../../modules/ingestion-v2/entity";
import { IngestionRepository } from "../../../modules/ingestion-v2/repository";
import { SubstanceNotFoundError } from "../../../modules/substance/errors/substance-not-found";
import { SubstanceRepository } from "../../../modules/substance/repository";
import { IngestSubstanceCommand } from "./command";
import { IngestedSubstanceResponseDTO } from "./response";

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

		const dosage = 5;

		let ingestion = new Ingestion({
			substance,
			user,
			route,
			amount: dosage,
			date: ingestedAt,
		});

		ingestion = await this.ingestionRepository.save(ingestion);

		return {
			substance: ingestion.substance.name,
			dosage: String(ingestion.amount),
			dateOfIngestion: ingestion.date,
			dosageClassification: ingestion.dosageClassification,
			routeOfAdministration: ingestion.route,
		};
	}
}
