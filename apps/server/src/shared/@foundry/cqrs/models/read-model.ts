import { UniqueId } from '../../indexing/unique-id'
import { ModelPayload } from './model-payload'

export abstract class ReadModel<ID extends UniqueId = UniqueId, Properties = unknown> {
  readonly id: ID

  constructor(payload: ModelPayload<ID, Properties>) {
    this.id = payload.id
    Object.assign(this, payload)
  }
}
