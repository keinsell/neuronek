import diod, { Newable } from 'diod'

import { JwtStrategy } from '../../../deprecated/authorization/jwt-strategy.js'
import { EffectModule } from '../../../deprecated/effect/effect.module.js'
import { MeilisearchService } from '../../../deprecated/search/search.service.js'
import { UserModule } from '../../../deprecated/user/user.module.js'
import { DependencyInjectionModule } from '../../module.js'
import { PrismaService } from '../prisma/prisma.js'
import { SubstanceModule } from '../../../deprecated/substance/substance.module.js'
import { IngestionModule } from '../../../deprecated/ingestion/ingestion.module.js'

const builder = new diod.ContainerBuilder()

// TODO: Find a good way to minimalise this file, probably some xyz.module.ts files that will hold dependency injection infomrmation, then we could just import modules.

const modules: Newable<DependencyInjectionModule>[] = [UserModule, EffectModule, SubstanceModule, IngestionModule]

builder.register(PrismaService).useInstance(new PrismaService())
builder.register(JwtStrategy).useInstance(new JwtStrategy())
builder.registerAndUse(MeilisearchService)

modules.forEach(module => new module(builder).register())

export const container = builder.build()

// Add Indexing Tasks for MeiliSearch here
container.get(MeilisearchService).index()

export { container as iocContainer }
