import { Chrono } from "chrono-node";
import collect from "collect.js";
import ms from "ms";
import { RouteOfAdministrationType } from "../substances/route-of-administration/entities/route-of-administration.entity";
import { DosageClassification } from "../substances/substance/entities/dosage.entity";
import { PhaseType } from "../substances/substance/entities/phase.entity";
import { PsychoactiveClass } from "../substances/substance/entities/psychoactive-class.enum";
import { SubstanceService } from "../substances/substance/substance.service";
import { User } from "../user/entities/user.entity";
import { IngestionPlan } from "./dtos/ingestion-plan.dto";
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
    ) as DosageClassification;

    const plannedIngestion: Partial<IngestionPlan> = {};

    plannedIngestion.substance = interalSubstance.name;
    plannedIngestion.dosage = dosageClassifcation;

    const ingestionRoute = interalSubstance.getRouteOfAdministraiton(route);

    if (!ingestionRoute) {
      throw new Error("Route of administration not found.");
    }

    plannedIngestion.route = route;

    // Information about substance duration

    const timeOfPostiveEffectsPromotedByIngestion =
      interalSubstance.getDurationOfEffectsForRouteOfAdministrationToPeak(
        route
      );

    const timeOfNegativeEffectsPromotedByIngestion =
      interalSubstance.getDurationOfEffectsForRouteOfAdministrationAfterPeak(
        route
      );

    const timeNeededToNoticeFirstEffects = ingestionRoute.duration.onset;

    const totalTimeOfEffectsPromotedByIngestion =
      timeNeededToNoticeFirstEffects +
      timeOfNegativeEffectsPromotedByIngestion +
      timeOfPostiveEffectsPromotedByIngestion;

    const dateOfFirstEffects = Date.now() + timeNeededToNoticeFirstEffects;

    plannedIngestion.effectsWillStartAt = new Date(dateOfFirstEffects);

    plannedIngestion.effectsWillWearOffAt = new Date(
      dateOfFirstEffects + timeOfPostiveEffectsPromotedByIngestion
    );

    plannedIngestion.aftereffectsWillWearOffAt = new Date(
      dateOfFirstEffects + totalTimeOfEffectsPromotedByIngestion
    );

    // eslint-disable-next-line sonarjs/no-unused-collection
    const stages: [
      {
        stage: PhaseType;
        willStartAt: Date;
        willEndAt: Date;
        description?: string | undefined;
        effects?: string | undefined;
      }?
    ] = [];

    for (const phase of Object.values(PhaseType)) {
      const timeToPhase = interalSubstance.getTimeToSpecificPhase(route, phase);
      const phaseDuration = interalSubstance.getDurationOfSpecificPhase(
        route,
        phase
      );

      console.log(
        new Chrono().parse(new Date(Date.now() + timeToPhase).toISOString())[0]
          ?.start
      );

      stages.push({
        stage: phase,
        willStartAt: new Date(Date.now() + timeToPhase),
        willEndAt: new Date(Date.now() + timeToPhase + phaseDuration),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plannedIngestion.stages = stages as any;

    plannedIngestion.takedowns = [];

    plannedIngestion.takedowns.push(
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
      plannedIngestion.takedowns.push(
        `It's not recommended to ingest stimulants in the evening or at night, as they may seriously impact your sleeping pattern. Such ingestion may block your sleep until (or at least) ${new Date(
          Date.now() + totalTimeOfEffectsPromotedByIngestion
        ).toLocaleTimeString()}`
      );
    }

    // Guard against theresholdDosage
    if (dosageClassifcation === "thereshold") {
      plannedIngestion.takedowns.push(
        `Dosage of ${dosage}mg is considered to be a thereshold dosage, which may not produce any subjective effects.`
      );
    }

    // Guard against stronger dosages
    if (dosageClassifcation === "heavy" || dosageClassifcation === "strong") {
      plannedIngestion.takedowns.push(
        `Dosage of ${dosage}mg is considered to be a ${dosageClassifcation} dosage, which may produce overwhelming subjective effects along with unecessary strain for one's body which may lead to serious health issues.`
      );
    }

    // Guard against overdoses
    if (dosageClassifcation === "overdose") {
      plannedIngestion.takedowns.push(
        `Dosage of ${dosage}mg is considered to be a overdose, which doesn't have any positive effects and may produce overwhelming subjective effects along with serious (unreversable) health risks and even death.`
      );
    }

    const effects = interalSubstance.getIngestionSpecificEffects(
      dosageClassifcation as DosageClassification,
      route
    );

    const effectsConsideredAsProducedBySubstance = collect(effects)
      .filter(
        (v) =>
          v.phases?.includes(PhaseType.comeup) ||
          v.phases?.includes(PhaseType.peak) ||
          v.phases?.length === 0 ||
          false
      )
      .all();

    const effectsConsideredAsAftereffects = collect(effects)
      .filter(
        (v) =>
          v.phases?.includes(PhaseType.aftereffects) ||
          v.phases?.length === 0 ||
          false
      )
      .all();

    console.log(effectsConsideredAsAftereffects.map((v) => v.effect.name));

    // TODO: We should split effects into positive and negative I think

    if (
      interalSubstance.getIngestionSpecificEffects(
        dosageClassifcation as DosageClassification,
        route
      ).length > 0
    ) {
      plannedIngestion.takedowns.push(
        `${
          interalSubstance.name
        } in ${dosageClassifcation} dosage may produce following effects: ${effectsConsideredAsProducedBySubstance
          .map((v) => v.effect.name)
          .join(", ")
          .toLowerCase()}`,
        `${
          interalSubstance.name
        } in ${dosageClassifcation} dosage may lead to following effects that can be considered negative after or during experience: ${effectsConsideredAsAftereffects
          .map((v) => v.effect.name)
          .join(", ")
          .toLowerCase()}`
      );
    } else {
      plannedIngestion.takedowns.push(
        `There are no known effects in our system of ${interalSubstance.name} in ${dosageClassifcation} dosage. THIS DOESN'T MEAN THAT THERE ARE NO EFFECTS, IT MEANS THAT WE DON'T KNOW ABOUT THEM. You should most likely lookup other relatable sources such as PsychonautWiki, Tripsit or Erowid`
      );
    }

    // TODO: We should query journal of user (for past 3 months maybe because that's the longest possible time for a substance to be in the system) and check if he has ingested this substance before - analyze if this ingestion will match with abuse prevention and maybe it's redose. Messy functionality a bit.

    plannedIngestion.interactions = [];

    return plannedIngestion;
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
      // eslint-disable-next-line prefer-const
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
