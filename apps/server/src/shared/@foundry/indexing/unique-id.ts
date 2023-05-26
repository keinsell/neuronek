import { CUID } from './cuid.js'
import { SequentialID } from './sequential-id.js'

export type UniqueId = string | number | bigint | SequentialID | CUID
