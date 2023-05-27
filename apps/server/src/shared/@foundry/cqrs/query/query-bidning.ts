import { Query } from './query'
import { QueryHandler } from './query-handler'

export interface QueryBidning {
	handler: QueryHandler<any>
	query: typeof Query | any
}
