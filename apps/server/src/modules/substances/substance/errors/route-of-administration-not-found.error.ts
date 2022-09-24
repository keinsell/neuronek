import { ApplicationError } from "../../../../common/error/error.common.js";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity.js";
import { Substance } from "../entities/substance.entity.js";

export class RouteOfAdministrationNotFound extends ApplicationError {
	constructor(
		route?: RouteOfAdministrationType | string,
		substance?: Substance | string,
	) {
		let message = "Route of administration not found.";

		if (route && substance) {
			message = `Route of administration not found. Queried ${route} for ${
				substance instanceof Substance ? substance.name : substance
			}.`;
		}

		super(message);
	}
}
