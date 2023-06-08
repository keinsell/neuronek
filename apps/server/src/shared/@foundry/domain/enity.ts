import { WriteModel } from '~foundry/cqrs/models/write-model.js'
import { IdentifierMissing } from '../exceptions/identifier-missing.js'
import { UniqueId } from '../indexing/unique-id.js'



/**
 * Entities are pretty much the bread and butter of domain modeling.
 *
 * They are the objects that represent the data that is being manipulated by the application.
 *
 * @version 1.0.0
 * @author Jakub "keinsell" Olan <keinsell@protonmail.com>
 * @see [Understanding Domain Entities](https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/)
 */
export abstract class Entity<T extends UniqueId = UniqueId> implements WriteModel<T, unknown> {
  /** Automatically generated (or imported) id of specific entity. Used to
  reference a right object in the persistence layer. */
  public readonly _id: T | undefined

  protected constructor(id?: T | undefined) {
    this._id = id
  }

  get id(): T {
    if (!this._id) {
      throw new IdentifierMissing(this)
    }
    return this._id
  }
}
