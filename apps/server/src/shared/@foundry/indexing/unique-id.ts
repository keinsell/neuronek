import { NanoID }       from '~foundry/indexing/nanoid/index.js'
import { ULID }         from '~foundry/indexing/ulid/index.js'
import { CUID }         from './cuid.js'
import { SequentialID } from './sequential-id/sequential-id.js'



export type UniqueId = SequentialID | CUID | ULID | NanoID
