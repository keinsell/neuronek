// These data would be used mostly for in-platform sharing and are optional to respect user's privacy, weight,
// age, and height will be actually used to define personalised dosage.
// Additionall data will be anonimized and maybe sent to analitics to support public reseach.

import { NotImplemented } from "~foundry/exceptions/not-implemented.js"

export interface Subject {
	// Subject may be linked to specific account.
	// MAY because we'll be aggregating experience reports from external sources and we would like to segregate
	// experiences by subjects which would make research a bit more transparent.
	accountId?: string
	displayName?: string
	firstName?: string
	lastName?: string
	birthDate?: Date
	weight?: number
	height?: number
	nationality?: string
	// TODO: We may think about health conditions, mental disorders or some other data that may be worthly for analitics.
}

export function updateSubject(
	_subjectId: string,
	_payload: Partial<Subject>
): Subject {
	throw new NotImplemented(updateSubject)
}

export function deleteSubject(_subjectId: string): Promise<void> {
	throw new NotImplemented(deleteSubject)
}
