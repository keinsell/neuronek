import gql from "graphql-tag";

export const psychonautWikiTypedefs = gql`
  type SubstanceClass {
    chemical: [String]
    psychoactive: [String]
  }

  type SubstanceTolerance {
    full: String
    half: String
    zero: String
  }

  interface RoaRange {
    min: Float
    max: Float
  }

  type SubstanceRoaRange implements RoaRange {
    min: Float
    max: Float
  }

  type SubstanceRoaDurationRange implements RoaRange {
    min: Float
    max: Float
    units: String
  }

  type SubstanceRoaDose {
    units: String
    threshold: Float
    heavy: Float
    common: SubstanceRoaRange
    light: SubstanceRoaRange
    strong: SubstanceRoaRange
  }

  type SubstanceRoaDuration {
    afterglow: SubstanceRoaDurationRange
    comeup: SubstanceRoaDurationRange
    duration: SubstanceRoaDurationRange
    offset: SubstanceRoaDurationRange
    onset: SubstanceRoaDurationRange
    peak: SubstanceRoaDurationRange
    total: SubstanceRoaDurationRange
  }

  type SubstanceRoa {
    name: String
    dose: SubstanceRoaDose
    duration: SubstanceRoaDuration
    bioavailability: SubstanceRoaRange
  }

  type SubstanceRoaTypes {
    oral: SubstanceRoa
    sublingual: SubstanceRoa
    buccal: SubstanceRoa
    insufflated: SubstanceRoa
    rectal: SubstanceRoa
    transdermal: SubstanceRoa
    subcutaneous: SubstanceRoa
    intramuscular: SubstanceRoa
    intravenous: SubstanceRoa
    smoked: SubstanceRoa
  }

  type SubstanceImage {
    thumb: String
    image: String
  }

  type Substance {
    name: String
    url: String
    featured: Boolean
    effects: [Effect]
    experiences: [Experience]
    class: SubstanceClass
    tolerance: SubstanceTolerance
    roa: SubstanceRoaTypes
    roas: [SubstanceRoa]
    summary: String
    images: [SubstanceImage]
    addictionPotential: String
    toxicity: [String]
    crossTolerances: [String]
    commonNames: [String]
    uncertainInteractions: [Substance]
    unsafeInteractions: [Substance]
    dangerousInteractions: [Substance]
  }

  type Effect {
    name: String
    url: String
    substances: [Substance]
    experiences: [Experience]
  }

  type Experience {
    substances: [Substance]
    effects: [Experience]
  }

  type Query {
    substances(
      effect: String
      query: String
      chemicalClass: String
      psychoactiveClass: String
      limit: Int = 10
      offset: Int = 0
    ): [Substance]
    substances_by_effect(
      effect: [String]
      limit: Int = 50
      offset: Int = 0
    ): [Substance]
    effects_by_substance(
      substance: String
      limit: Int = 50
      offset: Int = 0
    ): [Effect]
    experiences(
      substances_by_effect: String
      effects_by_substance: String
      substance: String
    ): [Experience]
  }
`;
