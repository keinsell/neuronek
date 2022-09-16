export interface IngestionPlan {
  substance: string;
  route: string;
  dosage: number;
  dosageClassifcation: string;
  effectsWillWearOffAt: Date;
  substanceWillWearOffAt: Date;
  ingestionWillLastFor: string;
  stages: [
    {
        stage: string;
        willStartAt: Date;
        willEndAt: Date;
        willLastFor: string;
    }
  ];
  interactions: [];
}
