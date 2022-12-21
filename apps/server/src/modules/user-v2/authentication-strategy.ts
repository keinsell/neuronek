import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { JsonWebTokenService } from "../../common/services/jsonwebtoken";
import { UserRepository } from "./repository";
import { User } from "./entity";

export interface JsonWebTokenPayload {
	id: string;
	/** Automatically generated username to identify user. */
	username: string;
	weight?: number;
	height?: number;
	dateOfBirth?: Date;
}

export const jwtAuthorizationStrategy = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: new JsonWebTokenService().JWT_SECRET,
		// TODO: Add issuer and audience
	},
	async (payload: JsonWebTokenPayload, done) => {
		const userRepository = new UserRepository();

		const user = await userRepository.findById(payload.id);

		if (!user) {
			return done(null, false);
		}

		return done(null, user);
	}
);
