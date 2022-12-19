import AWS from "aws-sdk";
import { ENVIRONMENT_VARIABLES } from "../../configuration/environment";

export const S3Infrastructure = new AWS.S3({
	endpoint: `${ENVIRONMENT_VARIABLES.S3_ENDPOINT}:${ENVIRONMENT_VARIABLES.S3_PORT}`,
	sslEnabled: ENVIRONMENT_VARIABLES.S3_USE_SSL,
	region: ENVIRONMENT_VARIABLES.S3_REGION,
	useAccelerateEndpoint: false,
	credentials: new AWS.Credentials(
		ENVIRONMENT_VARIABLES.S3_ACCESS_KEY,
		ENVIRONMENT_VARIABLES.S3_SECRET_KEY
	),
});
