import { PsychoactiveClass } from "./psychoactive-class.enum";

interface ClassMembershipProperties {
	psychoactiveClass: PsychoactiveClass;
	chemicalClass: string;
}

// TODO(#25, #26) We should think how to manage psychoactive and chemical classes well.
export class ClassMembership implements ClassMembershipProperties {
	psychoactiveClass: PsychoactiveClass;
	chemicalClass: string;

	constructor(properties: ClassMembershipProperties) {
		this.psychoactiveClass = properties.psychoactiveClass;
		this.chemicalClass = properties.chemicalClass;
	}
}
