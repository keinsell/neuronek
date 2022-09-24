export interface IMapper {
	toDomain(entity: unknown): unknown;
	toPersistence(entity: unknown, ...arguments_: unknown[]): unknown;
}
