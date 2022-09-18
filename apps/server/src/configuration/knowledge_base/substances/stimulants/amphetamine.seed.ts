import ms from "ms";
import { EffectOccurance } from "../../../../modules/effects/entities/effect-occurance.entity";
import { ChemicalNomenclature } from "../../../../modules/substance/entities/chemical-nomenclature";
import { ClassMembership } from "../../../../modules/substance/entities/class-membership.entity";
import { DosageClassification } from "../../../../modules/substance/entities/dosage.entity";
import { PsychoactiveClass } from "../../../../modules/substance/entities/psychoactive-class.enum";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "../../../../modules/route-of-administration/entities/route-of-administration.entity";
import { Substance } from "../../../../modules/substance/entities/substance.entity";
import { AnalysisEnhancement } from "../../effects/cognitive/analysis-enhancement.seed";
import { MotivationEnhancement } from "../../effects/cognitive/motivation-enhancement.seed";

export const Amphetamine: Substance = new Substance(
  {
    name: "Amphetamine",
    chemnicalNomencalture: new ChemicalNomenclature({
      commonNames: ["Amphetamine", "Speed", "Adderall", "Pep", "Fet"],
      substitutiveName: "α-Methylphenethylamine",
      systematicName: "(RS)-1-Phenylpropan-2-amine",
    }),
    classMembership: new ClassMembership({
      psychoactiveClass: PsychoactiveClass.stimulant,
      chemicalClass: "phenetylamine",
    }),
    administrationRoutes: [
      new RouteOfAdministration({
        route: RouteOfAdministrationType.insufflated,
        substanceName: "Amphetamine",
        bioavailability: 0.8,
        dosage: {
          thereshold: 4,
          light: 6,
          moderate: 15,
          strong: 30,
          heavy: 50,
          overdose: 100,
        },
        duration: {
          onset: ms("5m"),
          comeup: ms("90m"),
          peak: ms("2h"),
          offset: ms("3h"),
          aftereffects: ms("4h"),
        },
      }),
    ],
    effects: [
      new EffectOccurance({
        effect: AnalysisEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.light,
        description: "dfsfds?",
      }),
      new EffectOccurance({
        effect: MotivationEnhancement,
        substance: "Amphetamine",
        dosage: DosageClassification.moderate,
        description: "d?",
      }),
    ],
  },
  "amphetamine"
);
