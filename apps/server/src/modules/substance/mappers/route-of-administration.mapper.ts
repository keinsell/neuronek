import { IMapper } from "../../../common/mapper/mapper.common";
import { Substance } from "../entities/substance.entity";
import {
  Substance as PersistenceSubstance,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  Prisma,
} from "@prisma/client";
import { ChemicalNomenclature } from "../entities/chemical-nomenclature";
import { ClassMembership } from "../entities/class-membership.entity";
import { RouteOfAdministration } from "../entities/route-of-administration.entity";

export class RouteOfAdministrationMapper implements IMapper {
  toDomain(entity: PersistenceRouteOfAdministration): RouteOfAdministration {
    return new RouteOfAdministration(
      {
        route: entity.type as any,
        bioavailability: entity.bioavailability ?? 100,
        substanceName: entity.substanceName,
        dosage: {
          thereshold: entity.theresholdDosage,
          light: entity.lightDosage,
          moderate: entity.commonDosage,
          strong: entity.strongDosage,
          heavy: entity.heavyDosage,
          overdose: entity.lethalDosage ?? entity.heavyDosage * 2,
        },
        duration: {
          onset: entity.onset,
          comeup: entity.comeup,
          peak: entity.peak,
          offset: entity.offset,
          aftereffects: entity.aftereffects,
        },
      },
      entity.id
    );
  }

  toPersistence(
    entity: RouteOfAdministration
  ): Prisma.RouteOfAdministrationCreateInput {
    return {
      type: entity.route,
      /** @deprecated */
      isRecommended: false,
      bioavailability: entity.bioavailability ?? null,
      theresholdDosage: entity.dosage.thereshold,
      lightDosage: entity.dosage.light,
      commonDosage: entity.dosage.moderate,
      strongDosage: entity.dosage.strong,
      heavyDosage: entity.dosage.heavy,
      /** @deprecated */
      lethalDosage: entity.dosage.overdose,
      /** @deprecated */
      toxicDosage: 0,
      onset: entity.duration.onset,
      comeup: entity.duration.comeup,
      peak: entity.duration.peak,
      offset: entity.duration.offset,
      aftereffects: entity.duration.aftereffects,
      Substance: {
        connect: {
          name: entity.substanceName,
        },
      },
    };
  }
}

export const routeOfAdministrationMapper = new RouteOfAdministrationMapper();
