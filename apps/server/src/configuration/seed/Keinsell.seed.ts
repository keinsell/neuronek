import { User } from "../../modules/user/entities/user.entity";
import { UserPassword } from "../../modules/user/vos/password.vo.js";

export const Keinsell: User = new User({
	username: "keinsell",
	password: await new UserPassword(
		"SuperDuperSecretPasswordThatEverybodyCanCrack",
	).build(),
	email: "keinsell@protonmail.com",
	firstName: "Jakub",
	lastName: "Olan",
	dateOfBirth: new Date("10-12-2000"),
	height: 182,
	weight: 65,
});
