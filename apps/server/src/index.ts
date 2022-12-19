import { HttpApplication } from "./application/http.application";
import logProcessErrors from "log-process-errors";
import { Substance } from "./modules/substance-v2/entity";
import { PsychoactiveClass } from "./modules/substance-v2/entities/psychoactive-class.enum";
import { RouteOfAdministration } from "./modules/substance-v2/entities/route-of-administration.entity";
import { RouteOfAdministrationClassification } from "./modules/substance-v2/entities/route-of-administration-classification.enum";
import { SubstanceRepository } from "./modules/substance-v2/repository";
logProcessErrors();

export async function main() {
	new HttpApplication().bootstrap();

	if (process.env.NODE_ENV === "development") {
		console.log(process.env.DATABASE_URI);
	}

	const caffeine = new Substance({
		name: "Caffeine",
		chemicalNomencalture: {
			common: ["Caffeine"],
		},
		psychoactiveClass: PsychoactiveClass.stimulant,
		chemicalClass: "Alkaloid",
		administrationBy: [
			new RouteOfAdministration({
				classification: RouteOfAdministrationClassification.oral,
				dosage: {
					thereshold: 50,
					light: 50,
					moderate: 200,
					heavy: 150,
					strong: 200,
					overdose: 250,
				},
				duration: {
					onset: 15,
					comeup: 15,
					peak: 60,
					offset: 60,
					aftereffects: 60,
				},
			}),
		],
	});

	try {
		const saved = await new SubstanceRepository().save(caffeine);
		console.log(saved);
	} catch (error) {
		console.log(error);
	}
}

await main();
