import {
	Prisma,
	User,
	Substance,
	RouteOfAdministration,
	Effect,
} from "@prisma/client";

/**
 * `DbRecords` is a namespace that contains all the types with database records, this is useful for mapping domain entities into persistence records and vice versa.
 */
export namespace DatabaseRecords {
	export type UserCreateRecord = Prisma.UserCreateInput;
	export type UserRecord = User;
	export type SubstanceCreateRecord = Prisma.SubstanceCreateInput;
	export type SubstanceRecord = Substance & {
		routesOfAdministraton: RouteOfAdministration[];
	};
	export type RouteOfAdministrationCreateRecord =
		Prisma.RouteOfAdministrationCreateInput;
	export type RouteOfAdministrationRecord = RouteOfAdministration;
}
