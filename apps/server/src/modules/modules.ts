import { ingestionModule } from "./ingestion-v2/submodule";
import { substanceModule } from "./substance/submodule";
import { userModule } from "./user-v2/submodule";

export namespace ApplicationModules {
	export const User = userModule;
	export const Substance = substanceModule;
	export const Ingestion = ingestionModule;
}
