
import { UniqueId } from '~foundry/indexing/unique-id';
import { ReadModel } from './read-model'

export abstract class WriteModel<ID extends UniqueId, Properites> extends ReadModel<ID, Properites> { }
