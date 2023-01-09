import { Entity } from "../entity";

/**
 * Mapper is a class that is responsible for mapping between domain and persistence layer.
 *
 * @version 1.0.0
 * @author Jakub "keinsell" Olan <keinsell@protonmail.com>
 * @see [Data Mapper Pattern](https://martinfowler.com/eaaCatalog/dataMapper.html)
 */
export abstract class Mapper<
	DomainEntity extends Entity,
	DbRecord,
    DbCreateRecord = DbRecord,
	ResponseDTO = any,
> {
	/**
	 * Method for converting domain entity to persistence record.
	 * @param entity Any {@link Entity `Entity`} instance.
	 */
	abstract toPersistence(entity: DomainEntity): DbCreateRecord;
	/**
	 * Method for converting persistence record to domain entity.
	 * @param record Any record from database.
	 */
	abstract toDomain(record: DbRecord): DomainEntity;

	/** Utility function which converts provided {@link Entity `Entity`} to provided type which usually should be Data Transfer Object. */
	abstract toResponse?(entity: DomainEntity): ResponseDTO;
}
