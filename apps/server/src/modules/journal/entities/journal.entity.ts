import ms from "ms";
import { Entity } from "../../../common/entity/entity.common";
import { Ingestion } from "../../ingestion/entities/ingestion.entity";
import { RouteOfAdministrationType } from "../../substance/entities/route-of-administration.entity";
import fs from "fs";
import { substanceService } from "../../substance/substance.service";

export type JournalFilter = {
  substance?: string;
  route?: RouteOfAdministrationType;
  psychoactiveClass?: string;
  timeSince?: number;
};

// TODO: Dumb fuck, please refactor these fucking array filters because my eyes are bleeding, some external library would be nice to somehow pipe this crap. I mean it works but it can be done better I think.

export interface JournalProperties {
  ingestions: Ingestion[];
}

export class Journal extends Entity implements JournalProperties {
  ingestions: Ingestion[];

  constructor(properties: JournalProperties, id?: string | number) {
    super(id);
    this.ingestions = properties.ingestions;
  }

  getIngestedSubstances() {
    const substances = this.ingestions.map((v) => v.substance);
    // Remove duplicates by substance name
    const uniqueSubstances = substances.filter(
      (v, i, a) => a.findIndex((t) => t.name === v.name) === i
    );

    return uniqueSubstances;
  }

  getActiveIngestions() {
    const activeIngestions = this.ingestions.filter((v) => v.isActive());
    return activeIngestions;
  }

  getProgressionOfActiveIngestions() {
    const activeIngestions = this.getActiveIngestions();

    const progression = activeIngestions.map((v) =>
      v.getIngestionProgression()
    );

    progression.map((v) => {
      console.info(
        `S: ${v?.substance} - P: ${v?.progress} - ST: ${v?.stage} - TL: ${v?.timeLeft}`
      );
    });

    return progression;
  }

  filterIngestions(filers: JournalFilter) {
    const { substance, route, psychoactiveClass, timeSince } = filers;

    const ingestions = this.ingestions.filter((v) => {
      if (substance && v.substance.name !== substance) {
        return false;
      }
      if (route && v.route !== route) {
        return false;
      }
      if (
        psychoactiveClass &&
        v.substance.classMembership.psychoactiveClass !== psychoactiveClass
      ) {
        return false;
      }
      if (timeSince && v.getTimeSinceIngestion() > timeSince) {
        return false;
      }
      return true;
    });

    return new Journal({ ingestions });
  }

  /** Get average dosage of ingestions. */
  getAverageDosage() {
    const totalDosage = this.ingestions.reduce((a, v) => a + v.dosage, 0);
    const averageDosage = totalDosage / this.ingestions.length;
    return averageDosage;
  }

  getSumDosage() {
    const totalDosage = this.ingestions.reduce((a, v) => a + v.dosage, 0);
    return totalDosage;
  }

  /** Get average time between ingestions. */
  getAverageTimeBetween() {
    const ingestions = this.ingestions.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const timeBetweenIngestions = ingestions.map((v, i, a) => {
      if (i === 0) {
        return 0;
      }
      return a[i].date.getTime() - a[i - 1].date.getTime();
    });
    const averageTimeBetweenIngestions =
      timeBetweenIngestions.reduce((a, v) => a + v, 0) /
      timeBetweenIngestions.length;

    console.info(
      `Analysed ${this.ingestions.length} ingestions of ${
        this.ingestions[0].substance.name
      }. - Average time between dosages: ${ms(averageTimeBetweenIngestions)}`
    );

    return averageTimeBetweenIngestions;
  }

  /** Get time since last ingestion. */
  getTimeSinceLast() {
    const ingestions = this.ingestions.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const lastIngestion = ingestions[ingestions.length - 1];
    const timeSinceLastIngestion = lastIngestion.getTimeSinceIngestion();
    return timeSinceLastIngestion;
  }

  /** Get date of first known ingestion. */
  getDateOfFirstIngestion() {
    const ingestions = this.ingestions.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const firstIngestion = ingestions[0];
    return firstIngestion.date;
  }

  /** Get date of last known ingestion. */
  getDateOfLastIngestion() {
    const ingestions = this.ingestions.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const lastIngestion = ingestions[ingestions.length - 1];
    return lastIngestion.date;
  }

  /** Get average dosage per day since first ingestion. */
  getAverageDosagePerDay() {
    const totalDosage = this.getSumDosage();

    const timeSinceFirstIngestion =
      new Date().getTime() - this.getDateOfFirstIngestion().getTime();

    const timeSinceFirstIngestionInDays = timeSinceFirstIngestion / ms("1d");

    const averageDosagePerDay = totalDosage / timeSinceFirstIngestionInDays;

    console.info(
      `Analysed ${this.ingestions.length} ingestions of ${
        this.ingestions[0].substance.name
      } in ${timeSinceFirstIngestionInDays.toFixed(
        2
      )} days. - Dosage per day: ${averageDosagePerDay.toFixed(2)}mg`
    );

    return averageDosagePerDay;
  }

  exportJournalToLocalTextFile() {
    const ingestions = this.ingestions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    const text = ingestions
      .map((v) => {
        return `* ${v.date.toString()} - ${v.substance.name} - ${v.route} - ${
          v.dosage
        }mg`;
      })
      .join("\n");

    fs.writeFileSync(`journals/keinsell.md`, text);
  }

  async importJournalfromLocalTextFile() {
    const text = fs.readFileSync(`journals/keinsell.md`, "utf8");
    const lines = text.split("\n");

    const ingestions = lines.map(async (v) => {
      const [date, substance, route, dosage] = v.split(" - ");

      const foundSubstance = await substanceService.findSubstanceByName(
        substance
      );

      if (!foundSubstance) {
        throw new Error(`Could not find substance ${substance}`);
      }

      return new Ingestion({
        substance: foundSubstance,
        route: route as RouteOfAdministrationType,
        dosage: Number(dosage.replace("mg", "")),
        date: new Date(date.replace("* ", "")),
      });
    });

    this.ingestions = await Promise.all(ingestions);

    return new Journal({ ingestions: this.ingestions });
  }
}
