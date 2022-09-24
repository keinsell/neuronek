import {
	Record,
	Optional,
	String as RString,
	Number as RNumber,
	InstanceOf,
	Static,
} from "runtypes";
import zxcvbn from "zxcvbn";

// Build strong password validator based on zxcvbn
const Password = RString.withBrand("password")
	.withConstraint(
		(s) => s.length >= 8 || "Password must be at least 8 characters long"
	)
	.withConstraint(
		(s) => s.length <= 64 || "Password must be at most 64 characters long"
	)
	.withConstraint(
		(s) =>
			zxcvbn(s).score > 2 ||
			`${zxcvbn(s).feedback.warning}. ${zxcvbn(
				s
			).feedback.suggestions.join(", ")}`
	);

export const RegisterUserBody = Record({
	/** Username asdassadasdsadasdasd */
	firstName: Optional(RString),
	lastName: Optional(RString),
	email: Optional(RString),
	password: Password,
	username: RString,
	dateOfBirth: Optional(InstanceOf(Date)),
	height: Optional(RNumber),
	weight: Optional(RNumber),
});

export type RegisterUserRequest = Static<typeof RegisterUserBody>;
