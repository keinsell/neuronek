import { User } from "./entity";
import {
	Paginated,
	PaginatedQueryParameters,
	Repository,
} from "../../common/lib/persistence/repository";

export class UserRepository implements Repository<User> {
	save(entity: User): Promise<User> {
		throw new Error("Method not implemented.");
	}
	findById(id: string): Promise<User | null> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	findAllPaginated(
		parameters: PaginatedQueryParameters
	): Promise<Paginated<User>> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	transaction<T>(callback: () => Promise<T>): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
