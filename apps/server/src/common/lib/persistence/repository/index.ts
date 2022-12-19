/*  Most of repositories will probably need generic
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific queries should be defined
    in a respective repository.
*/
export class Paginated<T> {
	readonly count: number;
	readonly limit: number;
	readonly page: number;
	readonly data: T[];

	constructor(count: number, limit: number, page: number, data: T[]) {
		this.count = count;
		this.limit = limit;
		this.page = page;
		this.data = data;
	}
}

export type OrderBy = { field: string | true; param: "ASC" | "DESC" };

export type PaginatedQueryParameters = {
	limit: number;
	page: number;
	offset: number;
	order: OrderBy;
};

export interface Repository<T> {
	save(entity: T): Promise<T>;
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
	findAllPaginated(
		parameters: PaginatedQueryParameters
	): Promise<Paginated<T>>;
	delete(id: string): Promise<void>;
	transaction<T>(callback: () => Promise<T>): Promise<T>;
}
