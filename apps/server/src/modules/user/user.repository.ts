import { Repository } from "@internal/common";
import { User } from "./user.entity.js";

export class UserRepository implements Repository<User> {
  save(entity: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  transaction<T>(callback: () => Promise<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
