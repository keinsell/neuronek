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

export const Coluracetam: Substance = new Substance(
  {
    name: "Coluracetam",
    chemnicalNomencalture: new ChemicalNomenclature({
      commonNames: ["Coluracetam", "BCI-540", "MKC-231"],
      substitutiveName:
        "N-(2,3-Dimethyl-5,6,7,8-tetrahydrofuro[2,3-b]quinolin-4-yl)-2-(2-oxo-1-pyrrolidinyl)acetamide",
      systematicName: "",
    }),
    classMembership: new ClassMembership({
      psychoactiveClass: "psychodelic",
      chemicalClass: "phenetylamine",
    }),
    administrationRoutes: [
      new RouteOfAdministration({
        route: RouteOfAdministrationType.oral,
        substanceName: "Coluracetam",
        bioavailability: 0.8,
        dosage: {
          thereshold: 1,
          light: 3,
          moderate: 5,
          strong: 10,
          heavy: 20,
          overdose: 1000,
        },
        duration: {
          onset: ms("30m"),
          comeup: ms("1h"),
          peak: ms("2h"),
          offset: ms("2h"),
          aftereffects: ms("2h"),
        },
      }),
    ],
    effects: [AnalysisEnhancement],
  },
  "coluracetam"
);
