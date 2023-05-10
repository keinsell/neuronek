import { CriteriaFilter } from './criteria-filter'

export interface Criteria<T> {
	filters?: CriteriaFilter<T>[]
	sort?: keyof T
	limit?: number
	offset?: number
}
