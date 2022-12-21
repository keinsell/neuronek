import { Chrono } from "chrono-node";
import { IngestSubstanceRequestDTO } from "../modules/ingestion/features/ingest-substance/request";
import { RouteOfAdministrationClassification } from "../modules/substance/entities/route-of-administration-classification.enum";

export const SAMPLE_INGESTIONS: IngestSubstanceRequestDTO[] = [
	{
		substance: "Caffeine",
		ingestedAt: new Chrono().parseDate("21 Dec 15:54")!,
		amount: "50mg",
		route: RouteOfAdministrationClassification.oral,
	},
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
