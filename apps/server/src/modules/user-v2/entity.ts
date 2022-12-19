import { Entity } from "../../common/lib/domain/entity";

export interface UserProperties {
	username: string;
	weight: number;
	height: number;
	birthdate: Date;
	publicKey: string;
	privateKey: string;
}

export class User extends Entity implements UserProperties {
	username: string;
	weight: number;
	height: number;
	birthdate: Date;
	publicKey: string;
	privateKey: string;

	constructor(properties: UserProperties, id?: string | number) {
		super(id);
		this.username = properties.username;
		this.weight = properties.weight;
		this.height = properties.height;
		this.birthdate = properties.birthdate;
		this.publicKey = properties.publicKey;
		this.privateKey = properties.privateKey;
	}
}
