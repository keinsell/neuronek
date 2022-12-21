import { substanceModule } from "./substance/submodule";
import { userModule } from "./user/submodule";

export namespace ApplicationModules {
	export const User = userModule;
	export const Substance = substanceModule;
}
