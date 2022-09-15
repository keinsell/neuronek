import ms from "ms";
import { idText } from "typescript";
import { ChemicalNomenclature } from "../../../../modules/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substance/entities/class-membership.entity";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "../../../../modules/substance/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substance/entities/substance.entity";

export const Mescaline: Substance = new Substance(
  {
    name: "Mescaline",
    chemnicalNomencalture: new ChemicalNomenclature({
      commonNames: ["Mescaline", "Peyote", "San Pedro", "Cactus", "Buttons"],
      substitutiveName: "3,4,5-Trimethoxyphenethylamine",
      systematicName: "2-(3,4,5-Trimethoxyphenyl)ethanamine",
    }),
    classMembership: new ClassMembership({
      psychoactiveClass: "psychodelic",
      chemicalClass: "phenetylamine",
    }),
    administrationRoutes: [
      new RouteOfAdministration({
        route: RouteOfAdministrationType.oral,
        substanceName: "Mescaline",
        bioavailability: 0.8,
        dosage: {
          thereshold: 50,
          light: 100,
          moderate: 200,
          strong: 400,
          heavy: 800,
          overdose: 1000,
        },
        duration: {
          onset: ms("90m"),
          comeup: ms("120m"),
          peak: ms("6h"),
          offset: ms("3h"),
          aftereffects: ms("36h"),
        },
      }),
    ],
    effects: [],
  },
  "mescaline"
);
