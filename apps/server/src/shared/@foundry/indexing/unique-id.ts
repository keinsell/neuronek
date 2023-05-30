import { ULID } from '~foundry/indexing/ulid/index.js'
import { CUID } from './cuid.js'
import { SequentialID } from './sequential-id.js'

type Brand<T, BrandName extends string> = T & { __brand: BrandName }
type UniqueIdBrand = 'UniqueIdBrand'

export type UniqueId = Brand<string | number | bigint | SequentialID | CUID | ULID, UniqueIdBrand>
