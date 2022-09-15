import { nanoid } from "nanoid";
export abstract class Entity {
  id: string | number;
  constructor(id?: string | number) {
    this.id = id ?? nanoid();
  }
}
