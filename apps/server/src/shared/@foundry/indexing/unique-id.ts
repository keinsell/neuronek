import { NanoID }       from '~foundry/indexing/nanoid/index.js'
import { ULID }         from '~foundry/indexing/ulid/index.js'
import { CUID }         from './cuid.js'
import { SequentialID } from './sequential-id/sequential-id.js'



type Brand<T, BrandName extends string> = T & { __brand: BrandName }
type UniqueIdBrand = 'UniqueIdBrand'

export type UniqueId = Brand<string | number | bigint | SequentialID | CUID | ULID | NanoID, UniqueIdBrand>
