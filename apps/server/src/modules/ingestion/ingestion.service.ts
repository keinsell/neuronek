import ms from "ms";
import { RouteOfAdministrationType } from "../route-of-administration/entities/route-of-administration.entity";
import { DosageClassification } from "../substance/entities/dosage.entity";
import { PsychoactiveClass } from "../substance/entities/psychoactive-class.enum";
import { SubstanceService } from "../substance/substance.service";
import { User } from "../user/entities/user.entity";
import { Ingestion } from "./entities/ingestion.entity";
import { IngestedSubstanceEvent } from "./events/ingested-substance.event";
import { ingestionRepository } from "./repositories/ingestion.repository";

export interface IngestSubstanceDTO {
  substance: string;
  dosage: number;
  route: RouteOfAdministrationType;
  purity?: number;
  date?: Date;
  purpose?: string;
  set?: string;
  setting?: string;
}

export interface MassIngestSubstanceDTO {
  substance: string;
  totalDosage: number;
  route: RouteOfAdministrationType;
  purity?: number;
  startingDate: Date;
  endingDate: Date;
  dosages?: number;
  interval?: number;
  purpose?: string;
  set?: string;
  setting?: string;
}

export interface IngestionPlanDTO {
  // Basic information about planned ingestion
  substance: string;
  dosage: string;
  route: string;

  // Analitical information about planned ingestion
  substanceWillPromoteEffectsFor: string;
  substanceWillPromoteAfterEffectsFor: string;

  // Takedowns on planned ingestion
  takedowns: string[];
}

export class IngestionService {
  ingestionRepository = ingestionRepository;
  substanceService = new SubstanceService();

  async ingestSubstance(ingestion: IngestSubstanceDTO, user: User) {
    const { substance, dosage, purity, date, route, set, setting, purpose } =
      ingestion;

    const substanceEntity = await this.substanceService.findSubstanceByName(
      substance
    );

    if (!substanceEntity) {
      throw new Error("Substance not found.");
    }

    const dedicatedIngestion = new Ingestion({
      substance: substanceEntity,
      route,
      dosage,
      purity,
      set,
      setting,
      purpose,
      date: date || new Date(),
      user: user,
    });

    const created = await this.ingestionRepository.save(dedicatedIngestion);

    new IngestedSubstanceEvent(created);

    return created;
  }

  // TODO: Domain Case - Disadvise usage of drugs if were not prescripted by doctor if user is under 24 years old as brain is still developing
  async planIngestion(ingestion: IngestSubstanceDTO) {
    const { substance, dosage, purity, route } = ingestion;

    const interalSubstance = await this.substanceService.findSubstanceByName(
      substance
    );

    if (!interalSubstance) {
      throw new Error("Substance not found.");
    }

    const dosageClassifcation = interalSubstance.getDosageClassification(
      dosage * (purity ?? 1),
      route
    );

    const timeOfPostiveEffectsPromotedByIngestion =
      interalSubstance.getDurationOfEffectsForRouteOfAdministrationToPeak(
        route
      );

    const timeOfNegativeEffectsPromotedByIngestion =
      interalSubstance.getDurationOfEffectsForRouteOfAdministrationAfterPeak(
        route
      );

    const totalTimeOfEffectsPromotedByIngestion =
      timeOfNegativeEffectsPromotedByIngestion +
      timeOfPostiveEffectsPromotedByIngestion;

    const takedowns: string[] = [];

    takedowns.push(
      `Ingestion will promote positive effects for ${ms(
        timeOfPostiveEffectsPromotedByIngestion,
        { long: true }
      )} and afterwards aftereffects for ${ms(
        totalTimeOfEffectsPromotedByIngestion -
          timeOfPostiveEffectsPromotedByIngestion,
        { long: true }
      )}, in total - effects of substance may be felt for ${ms(
        totalTimeOfEffectsPromotedByIngestion,
        { long: true }
      )}.`
    );

    // TODO: Harm-reduction-like cases should be moved out to separate harm-reduction dedicated module

    // Guard against StimulantUsageAtNightOrEvening
    if (
      interalSubstance.classMembership.psychoactiveClass ===
        PsychoactiveClass.stimulant &&
      (new Date().getHours() > 14 || new Date().getHours() < 8)
    ) {
      takedowns.push(
        `It's not recommended to ingest stimulants in the evening or at night, as they may seriously impact your sleeping pattern. Such ingestion may block your sleep until (or at least) ${new Date(
          Date.now() + totalTimeOfEffectsPromotedByIngestion
        ).toLocaleTimeString()}`
      );
    }

    // Guard against theresholdDosage
    if (dosageClassifcation === "thereshold") {
      takedowns.push(
        `Dosage of ${dosage}mg is considered to be a thereshold dosage, which may not produce any subjective effects.`
      );
    }

    // Guard against stronger dosages
    if (dosageClassifcation === "heavy" || dosageClassifcation === "strong") {
      takedowns.push(
        `Dosage of ${dosage}mg is considered to be a ${dosageClassifcation} dosage, which may produce overwhelming subjective effects along with unecessary strain for one's body which may lead to serious health issues.`
      );
    }

    // Guard against overdoses
    if (dosageClassifcation === "overdose") {
      takedowns.push(
        `Dosage of ${dosage}mg is considered to be a overdose, which doesn't have any positive effects and may produce overwhelming subjective effects along with serious (unreversable) health risks and even death.`
      );
    }

    const effects = interalSubstance.getIngestionSpecificEffects(
      dosageClassifcation as DosageClassification,
      route
    );

    // TODO: We should split effects into positive and negative I think

    if (
      interalSubstance.getIngestionSpecificEffects(
        dosageClassifcation as DosageClassification,
        route
      ).length > 0
    ) {
      takedowns.push(
        `${
          interalSubstance.name
        } in ${dosageClassifcation} dosage may produce following effects: ${effects
          .map((v) => v.effect.name)
          .join(", ")
          .toLowerCase()}`
      );
    } else {
      takedowns.push(
        `There are no known effects in our system of ${interalSubstance.name} in ${dosageClassifcation} dosage. THIS DOESN'T MEAN THAT THERE ARE NO EFFECTS, IT MEANS THAT WE DON'T KNOW ABOUT THEM. You should most likely lookup other relatable sources such as PsychonautWiki, Tripsit or Erowid`
      );
    }

    const ingestionPlan: IngestionPlanDTO = {
      substance: interalSubstance.name,
      dosage: dosageClassifcation,
      route: route,
      substanceWillPromoteEffectsFor: ms(
        timeOfPostiveEffectsPromotedByIngestion
      ),
      substanceWillPromoteAfterEffectsFor: ms(
        timeOfNegativeEffectsPromotedByIngestion
      ),
      takedowns: takedowns,
    };

    return ingestionPlan;
  }

  async autofillPastIngestionsByAmountAndDosages(
    ingestion: MassIngestSubstanceDTO,
    user: User
  ) {
    let {
      substance,
      totalDosage,
      purity,
      startingDate,
      endingDate,
      route,
      set,
      setting,
      purpose,
      dosages,
    } = ingestion;

    const substanceEntity = await this.substanceService.findSubstanceByName(
      substance
    );

    if (!substanceEntity) {
      throw new Error("Substance not found.");
    }

    const dateDifference = endingDate.getTime() - startingDate.getTime();

    if (!dosages) {
      const differenceInDays = dateDifference / (1000 * 3600 * 24);
      dosages = differenceInDays;
    }

    const interval = dateDifference / dosages;

    const ingestionPromises: Ingestion[] = [];

    for (let i = 0; i < dosages; i++) {
      const ingestionDate = new Date(startingDate.getTime() + interval * i);

      if (!substanceEntity.administrationRoutes[0]) {
        throw new Error("No administration routes found.");
      }

      const ingestion = new Ingestion({
        substance: substanceEntity,
        route: route,
        set: set,
        purity: purity,
        setting: setting,
        purpose: purpose,
        dosage: totalDosage / dosages,
        date: ingestionDate,
        user,
      });

      ingestionPromises.push(ingestion);
    }

    const ingestions: Ingestion[] = [];

    for await (const ing of ingestionPromises) {
      const created = await this.ingestionRepository.save(ing);
      new IngestedSubstanceEvent(created);
      ingestions.push(created);
    }

    return ingestions;
  }
}

export const ingestionService = new IngestionService();
