export abstract class Repository<T> {
    abstract save(entity: T): Promise<T>;
	abstract findById(id: string): Promise<T | null>;
    abstract findAll(): Promise<T[]>;
	// findAllPaginated(parameters: PaginatedQueryParameters): Promise<Paginated<T>>;
	abstract delete(id: string): Promise<void>;
	abstract transaction<T>(callback: () => Promise<T>): Promise<T>;
}