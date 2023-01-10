import { Entity } from "@internal/common";

export interface SubstanceProperties {
  name: string;
}

export class Substance extends Entity<SubstanceProperties> {}
