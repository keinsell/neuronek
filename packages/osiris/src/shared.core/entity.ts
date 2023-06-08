import { nanoid } from 'nanoid'

/** Entity represents objects that most likely should be saved into database. This modified version aims to introduce additional property which is `id` for easier manipulating data when used in database. */
export class Entity {
  public readonly id: any

  constructor(id?: any) {
    this.id = id || nanoid()
  }
}
