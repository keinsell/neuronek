export interface CriteriaFilter<T> {
	property: keyof T
	value: T[keyof T]
}
