// trunk-ignore(eslint)
export interface RouteOfAdministration {
    routeClassification: string;
    bioavailability?: number;
    theresholdDosage?: string;
    lightDosage?: string;
    moderateDosage?: string;
    strongDosage?: string;
    heavyDosage?: string;
    onsetDuration?: string;
    comeupDuration?: string;
    peakDuration?: string;
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
