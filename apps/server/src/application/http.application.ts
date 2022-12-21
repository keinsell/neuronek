import { App } from "@tinyhttp/app";
import { lruSend } from "lru-send";
import cors from "cors";
import bodyparser from "body-parser";
import {
	generateRoutes,
	generateSpec,
	ExtendedRoutesConfig,
	ExtendedSpecConfig,
} from "tsoa";
import { userModule } from "../modules/user-v2/submodule";
import { ApplicationModules } from "../modules/modules";
import { RequestIdInterceptor } from "../common/lib/application/interceptor/request-id";
import { jwtAuthorizationStrategy } from "../modules/user-v2/authentication-strategy";
import passport from "passport";

export class HttpApplication {
	private application: App;

	constructor() {
		this.application = new App();
		this.applyDevelopmentMiddleware();
		this.applyProductionMiddleware();
		this.applyMiddleware();
		this.attachComponents();
	}

	protected applyMiddleware() {
		this.application.use(bodyparser.json());
		this.application.use(bodyparser.urlencoded());
		this.application.use(lruSend());
		this.application.options("*", cors());
		passport.use(jwtAuthorizationStrategy);
		this.application.use(new RequestIdInterceptor().intercept);
	}

	protected applyDevelopmentMiddleware() {}
	protected applyProductionMiddleware() {}

	protected attachComponents() {
		this.application.use(ApplicationModules.User);
		this.application.use(ApplicationModules.Ingestion);
	}

	protected async openapi3() {
		const specOptions: ExtendedSpecConfig = {
			basePath: "",
			entryFile: "./api/server.ts",
			specVersion: 3,
			noImplicitAdditionalProperties: "silently-remove-extras",
			outputDirectory: "./",
			controllerPathGlobs: ["./**/*.controller.ts", "./**/controller.ts"],
			name: "neuronek",
			description: "Documentation of ongoing API of application.",
			version: "1.0.0",
			schemes: ["http"],
			contact: {
				name: "Jakub Olan",
				email: "keinsell@protonmail.com",
			},
			yaml: true,
			specFileBaseName: "oas3",
			spec: {
				tags: [
					{
						name: "User",
						description: "Operations about users",
						externalDocs: {
							description: "Find out more about users",
							url: "http://swagger.io",
						},
					},
				],
			},
		};

		const routeOptions: ExtendedRoutesConfig = {
			basePath: "",
			noImplicitAdditionalProperties: "silently-remove-extras",
			entryFile: "./src/index.ts",
			routesDir: "./dist",
		};

		await generateSpec(specOptions);
		await generateRoutes(routeOptions);

		console.log("📝 OpenAPI 3.0 spec generated");
	}

	public async bootstrap() {
		this.application.listen(1337);
		await this.openapi3();
		console.log("🚀 Server ready at: http://localhost:1337");
	}
}
