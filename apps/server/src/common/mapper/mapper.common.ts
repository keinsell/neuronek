export interface IMapper {
  toDomain(entity: unknown): unknown;
  toPersistence?(entity: unknown, ...args): unknown;
}
