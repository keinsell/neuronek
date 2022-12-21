import { ingestionModule } from "../modules/ingestion-v2/submodule";
import { substanceModule } from "../modules/substance/submodule";
import { userModule } from "./user/submodule";

export namespace ApplicationModules {
	export const User = userModule;
	export const Substance = substanceModule;
	export const Ingestion = ingestionModule;
}
