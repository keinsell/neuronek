export interface ResearchPaperProperties {
	/**
	 * @example "Pharmacology of integrative activity of the brain. Attempt at nootropic concept in psychopharmacology."
	 */
	title?: string
	/** **PMID** (PubMed identifier or PubMed unique identifier) is a unique integer value, starting at `1`, assigned to each PubMed record. A PMID is not the same as a PMCID (PubMed Central identifier) which is the identifier for all works published in the free-to-access PubMed Central.
	 * @example 4541214
	 */
	pmid?: number

	/** The International Standard Book Number (ISBN) is a numeric commercial book identifier that is intended to be unique. Publishers purchase ISBNs from an affiliate of the International ISBN Agency.
	 * @example "0-06-088473-8"
	 */
	isbn?: string
	authors?: string
	abstract?: string
}

export interface ResearchPaperJSON {
	title: string
	pmid?: number
	isbn?: string
	authors?: string
	abstract?: string
}

/**
 * Research Paper represents every scientific paper that cover data about substances.
 */
export class ResearchPaper implements ResearchPaperProperties {
	/**
	 * @example "Pharmacology of integrative activity of the brain. Attempt at nootropic concept in psychopharmacology."
	 */
	title?: string
	/** **PMID** (PubMed identifier or PubMed unique identifier) is a unique integer value, starting at `1`, assigned to each PubMed record. A PMID is not the same as a PMCID (PubMed Central identifier) which is the identifier for all works published in the free-to-access PubMed Central.
	 * @example 4541214
	 */
	pmid?: number

	/** The International Standard Book Number (ISBN) is a numeric commercial book identifier that is intended to be unique. Publishers purchase ISBNs from an affiliate of the International ISBN Agency.
	 * @example "0-06-088473-8"
	 */
	isbn?: string
	authors?: string
	abstract?: string

	constructor(props: ResearchPaperProperties) {
		Object.assign(this, props)
	}

	toJSON(): ResearchPaperJSON {
		return {
			title: this.title,
			pmid: this.pmid,
			isbn: this.isbn,
			authors: this.authors,
			abstract: this.abstract
		}
	}

	static fromJSON(json: ResearchPaperJSON) {
		return new ResearchPaper(json)
	}
}
