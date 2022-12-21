import { App } from "@tinyhttp/app";
import { IngestSubstanceController } from "./features/ingest-substance/controller";
import passport from "passport";

const ingestionModule = new App();

ingestionModule.post(
	"/ingestion",
	passport.authenticate("jwt", { session: false }),
	(request, res) =>
		new IngestSubstanceController().execute(request as any, res)
);

export { ingestionModule };
