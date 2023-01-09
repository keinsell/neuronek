/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Chrono } from "chrono-node";
import { IngestSubstanceRequestDTO } from "../modules/ingestion/features/ingest-substance/request";
import { RouteOfAdministrationClassification } from "../modules/substance/entities/route-of-administration-classification.enum";

export const SAMPLE_INGESTIONS: IngestSubstanceRequestDTO[] = [
	{
		substance: "Amphetamine",
		ingestedAt: new Chrono().parseDate("23 Dec 6:30")!,
		amount: "7mg",
		route: RouteOfAdministrationClassification.insufflated,
	},
	{
		substance: "Amphetamine",
		ingestedAt: new Chrono().parseDate("23 Dec 10:30")!,
		amount: "15mg",
		purity: 0.87,
		route: RouteOfAdministrationClassification.insufflated,
	},
	{
		substance: "Amphetamine",
		ingestedAt: new Chrono().parseDate("23 Dec 12:30")!,
		amount: "10mg",
		purity: 0.87,
		route: RouteOfAdministrationClassification.oral,
	},
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
