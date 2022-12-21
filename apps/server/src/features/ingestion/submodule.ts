import { App } from "@tinyhttp/app";
import { IngestSubstanceController } from "./ingest-substance/controller";
import passport from "passport";

const ingestionModule = new App();

ingestionModule.post(
	"/ingestion",
	passport.authenticate("jwt", { session: false }),
	(req, res) => new IngestSubstanceController().execute(req as any, res)
);

export { ingestionModule };
