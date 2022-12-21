import { nanoid } from "nanoid";
import { Entity } from "../../common/lib/domain/entity";
import { Ingestion } from "../ingestion/entity";

export interface UserProperties {
	username: string;
	weight?: number;
	height?: number;
	birthdate?: Date;
	recoveryKey: string;
}

export class User extends Entity implements UserProperties {
	username: string;
	weight?: number;
	height?: number;
	birthdate?: Date;
	recoveryKey: string;

	constructor(properties: UserProperties, id?: string | number) {
		super(id);
		this.username = properties.username;
		this.weight = properties.weight;
		this.height = properties.height;
		this.birthdate = properties.birthdate;
		this.recoveryKey = properties.recoveryKey;
	}

	public static generateUser() {
		return new User({
			username: nanoid(16),
			recoveryKey: nanoid(32),
		});
	}
}

export class UserWithIngestions extends User {
	ingestions: Ingestion[];
	constructor(user: User, ingestions: Ingestion[]) {
		super(user, user.id);
		this.ingestions = ingestions;
	}
}
