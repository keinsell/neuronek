import ms from "ms";
import { Entity } from "../../../common/entity/entity.common";
import { Journal } from "../../journal/entities/journal.entity";
import { PhaseType } from "../../substance/entities/phase.entity";
import { RouteOfAdministrationType } from "../../substance/entities/route-of-administration.entity";
import { Substance } from "../../substance/entities/substance.entity";

export interface IngestionProperties {
  substance: Substance;
  route: RouteOfAdministrationType;
  dosage: number;
  purity?: number;
  date: Date;
  purpose?: string;
  set?: string;
  setting?: string;
  linkedJournalId?: string;
}

export class Ingestion extends Entity implements IngestionProperties {
  substance: Substance;
  dosage: number;
  date: Date;
  route: RouteOfAdministrationType;
  purity?: number | undefined;
  purpose?: string | undefined;
  setting?: string | undefined;
  set?: string | undefined;
  linkedJournalId?: string;

  constructor(properties: IngestionProperties, id?: string | number) {
    super(id);
    this.substance = properties.substance;
    this.dosage = properties.dosage;
    this.date = properties.date;
    this.route = properties.route;
    this.purity = properties.purity;
    this.purpose = properties.purpose;
    this.setting = properties.setting;
    this.set = properties.set;
    this.linkedJournalId = properties.linkedJournalId;
  }

  getTimeSinceIngestion(): number {
    return Date.now() - this.date.getTime();
  }

  getIngestionStages() {
    const { date, substance, route, dosage } = this;
    const { administrationRoutes } = substance;

    const administrationRoute = administrationRoutes.find(
      (v) => v.route === route
    );

    if (!administrationRoute?.duration) {
      throw Error("No duration found for route of administration");
    }

    const { onset, comeup, peak, offset, aftereffects } =
      administrationRoute.duration;

    // TODO: Optimize this calculation in loop, I had no idea how to do it.

    const onsetStage = {
      stage: PhaseType.onset,
      isCompleted: this.getTimeSinceIngestion() > onset,
      startedAt: date,
      endedAt: new Date(date.getTime() + onset),
    };

    const comeupStage = {
      stage: PhaseType.comeup,
      isCompleted: this.getTimeSinceIngestion() > onset + comeup,
      startedAt: new Date(date.getTime() + onset),
      endedAt: new Date(date.getTime() + onset + comeup),
    };

    const peakStage = {
      stage: PhaseType.peak,
      isCompleted: this.getTimeSinceIngestion() > onset + comeup + peak,
      startedAt: new Date(date.getTime() + onset + comeup),
      endedAt: new Date(date.getTime() + onset + comeup + peak),
    };

    const offsetStage = {
      stage: PhaseType.offset,
      isCompleted:
        this.getTimeSinceIngestion() > onset + comeup + peak + offset,
      startedAt: new Date(date.getTime() + onset + comeup + peak),
      endedAt: new Date(date.getTime() + onset + comeup + peak + offset),
    };

    const aftereffectsStage = {
      stage: PhaseType.aftereffects,
      isCompleted:
        this.getTimeSinceIngestion() >
        onset + comeup + peak + offset + aftereffects,
      startedAt: new Date(date.getTime() + onset + comeup + peak + offset),
      endedAt: new Date(
        date.getTime() + onset + comeup + peak + offset + aftereffects
      ),
    };

    const stages = [
      onsetStage,
      comeupStage,
      peakStage,
      offsetStage,
      aftereffectsStage,
    ];

    return stages;
  }

  getIngestionStage() {
    const { date, substance, route, dosage } = this;
    const { administrationRoutes } = substance;

    const administrationRoute = administrationRoutes.find(
      (v) => v.route === route
    );

    if (!administrationRoute?.duration) {
      throw Error("No duration found for route of administration");
    }

    const { onset, comeup, peak, offset, aftereffects } =
      administrationRoute.duration;

    const stages = this.getIngestionStages();

    const currentStage = stages.find((v) => !v.isCompleted);

    if (!currentStage) {
      return undefined;
    }

    return currentStage;
  }

  getIngestionProgression() {
    const { date, substance, route, dosage } = this;
    const { administrationRoutes } = substance;

    const administrationRoute = administrationRoutes.find(
      (v) => v.route === route
    );

    if (!administrationRoute?.duration) {
      throw Error("No duration found for route of administration");
    }

    const { onset, comeup, peak, offset, aftereffects } =
      administrationRoute.duration;

    const totalTime = onset + comeup + peak + offset + aftereffects;
    const passedTime = this.getTimeSinceIngestion();
    const timeLeft = totalTime - passedTime;
    const progress = passedTime / totalTime;

    if (progress > 1 || progress < 0) {
      return undefined;
    }

    const currentStage = this.getIngestionStage();

    if (!currentStage) {
      return undefined;
    }

    return {
      substance: this.substance.name,
      totalTime: ms(totalTime),
      passedTime: ms(passedTime),
      timeLeft: ms(timeLeft),
      stage: this.getIngestionStage()?.stage,
      nextStageIn: ms(currentStage.endedAt.getTime() - Date.now()),
      progress: `${Number(progress * 100).toFixed(2)}%`,
    };
  }

  // TODO: Should also return classification of dosage ex. light, moderate
  getIngestionDosage() {
    const { substance, dosage, purity } = this;

    if (purity) {
      return (dosage * purity) / purity;
    }

    return dosage;
  }

  isActive() {
    const { date, substance, route, dosage } = this;
    const { administrationRoutes } = substance;

    const administrationRoute = administrationRoutes.find(
      (v) => v.route === route
    );

    if (!administrationRoute?.duration) {
      throw Error("No duration found for route of administration");
    }

    const { onset, comeup, peak, offset, aftereffects } =
      administrationRoute.duration;

    const totalTime = onset + comeup + peak + offset + aftereffects;
    const passedTime = this.getTimeSinceIngestion();

    return passedTime < totalTime;
  }

  //   getIngestionProgression(): number {}
}
