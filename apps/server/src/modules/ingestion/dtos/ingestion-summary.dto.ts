import { PhaseType } from "../../substances/substance/entities/phase.entity";

/** Ingestion summary is data transfer object to provide human-readable details about selected ingestion. */
export interface IngestionSummary {
  substance: string;
  dosage: string;
  route: string;
  hasEnded: boolean;
  progress: string;
  ingestionWillLastFor: string;
  ingestionLastsFor: string;
  ingestionStatedAt: Date;
  ingestionEndedAt?: Date;
  stages: [
    {
      stage: PhaseType;
      isCompleted: boolean;
      progress: string;
      startedAt: Date;
      completedAt: Date;
      /** @example "Insufflated 2C-B causes several nasal burning, however onset of substance changes perception of felt pain so you can expect this effect to last about 5 minutes. Futher effects that you may notice are slight changes in your vision and felt body form." */
      description?: string;
      effects?: string[];
    }
  ];
}
