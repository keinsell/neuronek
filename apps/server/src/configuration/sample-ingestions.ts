import { Chrono } from "chrono-node";
import { IngestSubstanceRequestDTO } from "../features/ingestion/ingest-substance/request";
import { RouteOfAdministrationClassification } from "../modules/substance/entities/route-of-administration-classification.enum";

export const SAMPLE_INGESTIONS: IngestSubstanceRequestDTO[] = [
	{
		substance: "Amphetamine",
		ingestedAt: new Chrono().parseDate("21 Dec 13:43")!,
		amount: "3mg",
		route: RouteOfAdministrationClassification.insufflated,
	},
	{
		substance: "Amphetamine",
		ingestedAt: new Chrono().parseDate("21 Dec 10:00")!,
		amount: "3mg",
		route: RouteOfAdministrationClassification.insufflated,
	},
];
