import { App } from "@tinyhttp/app";
import { urlencoded } from "milliparsec";
import { lruSend } from "lru-send";
import cors from "cors";
import { userRouter } from "../modules/user/routers/user.router";
import {
	generateRoutes,
	generateSpec,
	ExtendedRoutesConfig,
	ExtendedSpecConfig,
} from "tsoa";

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
		this.application.use(urlencoded());
		this.application.use(lruSend());
		this.application.options("*", cors());
	}

	protected applyDevelopmentMiddleware() {}
	protected applyProductionMiddleware() {}

	protected attachComponents() {
		this.application.use(userRouter);
	}

	protected async openapi3() {
		const specOptions: ExtendedSpecConfig = {
			basePath: "/api",
			entryFile: "./api/server.ts",
			specVersion: 3,
			noImplicitAdditionalProperties: "silently-remove-extras",
			outputDirectory: "./",
			controllerPathGlobs: ["./**/*.controller.ts"],
			name: "Neuronek",
			description: "Early version of Neuronek API.",
			version: "1.0.0",
			schemes: ["http"],
			contact: {
				name: "Jakub Olan",
				email: "keinsell@protonmail.com",
			},
			yaml: true,
			specFileBaseName: "oa3",
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
			basePath: "/api",
			noImplicitAdditionalProperties: "silently-remove-extras",
			entryFile: "./src/index.ts",
			routesDir: "./dist",
		};

		await generateSpec(specOptions);
		await generateRoutes(routeOptions);

		console.log("📝 OpenAPI 3.0 spec generated");
	}

	public async bootstrap() {
		this.application.listen(4000);
		await this.openapi3();
		console.log("🚀 Server ready at: http://localhost:4000");
	}
}
