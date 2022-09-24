export interface RegisterUserDTO {
	firstName?: string;
	lastName?: string;
	email?: string;
	password: string;
	username: string;
	dateOfBirth?: Date;
	height?: number;
	weight?: number;
}
