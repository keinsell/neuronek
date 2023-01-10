import {
  RouteOfAdministrationClassification,
  DosageClassification,
  PhaseClassification,
} from "@internal/datastore";
import { TimeRange, Entity } from "@internal/common";

interface RouteOfAdministrationProperties {
  routeClassification: RouteOfAdministrationClassification;
  dosage: {
    [dosage in DosageClassification]: string;
  };
  phases: [];
  totalDuration: TimeRange;
  effects?: {};
}

export class RouteOfAdministration extends Entity<RouteOfAdministrationProperties> {}

export class RouteOfAdministrationWithFlatRelations extends RouteOfAdministration {
  substanceId: string;

  constructor(
    relations: {
      substanceId: string;
    },
    props: RouteOfAdministrationProperties,
    id?: string
  ) {
    super(props, id);
    this.substanceId = relations.substanceId;
  }
}
