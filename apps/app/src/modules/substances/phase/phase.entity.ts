import { Entity } from "@internal/common";

export interface PhaseProperties {
  effects?: {};
}

export class Phase extends Entity<PhaseProperties> {}
