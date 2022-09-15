import ms from "ms";
import { idText } from "typescript";
import { ChemicalNomenclature } from "../../../../modules/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substance/entities/class-membership.entity";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "../../../../modules/substance/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substance/entities/substance.entity";
import { AnalysisEnhancement } from "../../effects/cognitive/analysis-enhancement.seed";

export const IDRA21: Substance = new Substance(
  {
    name: "IDRA-21",
    chemnicalNomencalture: new ChemicalNomenclature({
      commonNames: ["IDRA-21"],
      substitutiveName: "",
      systematicName:
        "7-chloro-3-methyl-3,4-dihydro-2H-1λ6,2,4-benzothiadiazine 1,1-dioxide",
    }),
    classMembership: new ClassMembership({
      psychoactiveClass: "nootropic",
      chemicalClass: "phenetylamine",
    }),
    administrationRoutes: [
      new RouteOfAdministration({
        route: RouteOfAdministrationType.oral,
        substanceName: "IDRA-21",
        bioavailability: 0.8,
        dosage: {
          thereshold: 1,
          light: 3,
          moderate: 5,
          strong: 15,
          heavy: 25,
          overdose: 1000,
        },
        duration: {
          onset: ms("30m"),
          comeup: ms("1h"),
          peak: ms("2h"),
          offset: ms("4h"),
          aftereffects: ms("20h"),
        },
      }),
    ],
    effects: [AnalysisEnhancement],
  },
  "coluracetam"
);
