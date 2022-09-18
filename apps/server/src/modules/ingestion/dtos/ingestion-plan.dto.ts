import { DosageClassification } from "../../substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../substance/entities/substance.entity";

export interface IngestionPlan {
  substance: Substance;
  route: RouteOfAdministrationType;
  dosage: DosageClassification;
  effectsWillWearOffAt: Date;
  aftereffectsWillWearOffAt: Date;
  substanceWillWearOffAt: Date;
  stages: [
    {
      stage: string;
      willStartAt: Date;
      willEndAt: Date;
      description?: string;
      effects?: string;
    }
  ];
  interactions?: [];
}
