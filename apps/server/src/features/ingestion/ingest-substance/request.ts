import { RouteOfAdministrationClassification } from "../../../modules/substance/entities/route-of-administration-classification.enum";

export interface IngestSubstanceRequestDTO {
	/**
	 * Ingested substance name, this is not id of substance, but name of substance, as user may ingest substance which is not yet in database and we wish to collect information about them or link these request to existing substances to provide better information for users.
	 *
	 * EDIT: As actual state of application, server will reject requests with not existing substances, so this is not actual anymore.
	 *
	 * @example "Amphetamine"
	 */
	substance: string;
	/**
	 *
	 * Dosage of ingested substance, expressed in string which allows to calculate amount of substance ingested, for example "5mg" or "1g".
	 *
	 * @example "5mg"
	 */
	amount: string;
	/**
	 * @example 0.9
	 */
	purity?: number;
	/**
	 * @example "oral"
	 */
	route: RouteOfAdministrationClassification;
	/**
	 * @example ""
	 */
	ingestedAt: Date;
	/**
	 * Information about state of ingestion, as some ingestions may be planned but not actually consumed - once consumed, ingestion will update ingestion date, if such value will be not provided ingestion will start as it's created.
	 *
	 * @example true
	 */
	isConsumed?: boolean;
}
