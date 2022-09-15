interface ClassMembershipProperties {
  psychoactiveClass: string;
  chemicalClass: string;
}

export class ClassMembership implements ClassMembershipProperties {
  psychoactiveClass: string;
  chemicalClass: string;

  constructor(properties: ClassMembershipProperties) {
    this.psychoactiveClass = properties.psychoactiveClass;
    this.chemicalClass = properties.chemicalClass;
  }
}
