import { IMapper } from "../mapper/mapper.common";

export abstract class Repository<T> {
	db: unknown;
	mapper?: IMapper;
	abstract exists(entity: T): Promise<boolean>;
	abstract save(entity: T): Promise<T>;
	abstract delete(entity: T): Promise<boolean>;
}
