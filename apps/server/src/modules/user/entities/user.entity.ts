import { Entity } from "../../../common/entity/entity.common";

export interface UserProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	password: string;
	username: string;
	dateOfBirth?: Date;
	height?: number;
	weight?: number;
}

export class User extends Entity implements UserProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	password: string;
	username: string;
	dateOfBirth?: Date;
	height?: number;
	weight?: number;

	constructor(properties: UserProperties, id?: string | number) {
		super(id);
		this.firstName = properties.firstName;
		this.lastName = properties.lastName;
		this.email = properties.email;
		this.password = properties.password;
		this.username = properties.username;
		this.dateOfBirth = properties.dateOfBirth;
		this.height = properties.height;
		this.weight = properties.weight;
	}
}
