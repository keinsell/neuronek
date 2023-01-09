// trunk-ignore(eslint)
export interface RouteOfAdministration {
  routeClassification: string;
  bioavailability?: number;
  /**
   * The dosage that is considered to be a thershold dosage.
   * @example "1g-2g"
   */
  theresholdDosage?: string;
  /**
   * The dosage that is considered to be a light dosage.
   * @example "1g-2g"
   */
  lightDosage?: string;
  /**
   * The dosage that is considered to be a moderate dosage.
   * @example "1g-2g"
   */
  moderateDosage?: string;
  /**
   * The dosage that is considered to be a strong dosage.
   * @example "1g-2g"
   */
  strongDosage?: string;
  /**
   * The dosage that is considered to be a heavy dosage.
   * @example "1g-2g"
   */
  heavyDosage?: string;
  onsetDuration?: string;
  /**
   * The time it takes for the effects to reach their peak.
   * @example "1h30m-2h"
   */
  comeupDuration?: string;
  /**
   * The time it takes for the effects to reach their peak.
   * @example "1h30m-2h"
   */
  peakDuration?: string;
  /**
   * The time it takes for the effects to start to wear off.
   * @example "1h30m-2h"
   */
  offsetDuration?: string;
  aftereffectsDuration?: string;
}

export interface Substance {
  name: string;
  commonNomenclature?: string[];
  substitutiveNomenclature?: string;
  systematicNomenclature?: string;
  psychoactiveClass?: string;
  chemicalClass?: string;
  routesOfAdministration?: RouteOfAdministration[];
}
