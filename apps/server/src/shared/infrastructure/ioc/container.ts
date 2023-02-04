import diod, { Newable } from 'diod'

import { JwtStrategy } from '../../../modules/authorization/jwt-strategy.js'
import { EffectModule } from '../../../modules/effect/effect.module.js'
import { UserModule } from '../../../modules/user/user.module.js'
import { DependencyInjectionModule } from '../../common/module/module.js'
import { PrismaService } from '../prisma/prisma.js'

const builder = new diod.ContainerBuilder()

// TODO: Find a good way to minimalise this file, probably some xyz.module.ts files that will hold dependency injection infomrmation, then we could just import modules.

const modules: Newable<DependencyInjectionModule>[] = [UserModule, EffectModule]

builder.register(PrismaService).useInstance(new PrismaService())
builder.register(JwtStrategy).use(JwtStrategy)

modules.forEach(module => new module(builder).register())

export const container = builder.build()
export { container as iocContainer }
