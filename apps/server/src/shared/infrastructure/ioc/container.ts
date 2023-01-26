import diod, { Newable } from 'diod'
import { PrismaService } from '../prisma/prisma.js'
import { DependencyInjectionModule } from '../../common/module/module.js'
import { UserModule } from '../../../modules/user/user.module.js'
import { JwtStrategy } from '../../../modules/user/authorization/jwt-strategy.js'
import { Strategy } from 'passport-jwt'

const builder = new diod.ContainerBuilder()

// TODO: Find a good way to minimalise this file, probably some xyz.module.ts files that will hold dependency injection infomrmation, then we could just import modules.

const modules: Newable<DependencyInjectionModule>[] = [UserModule]

builder.register(PrismaService).useInstance(new PrismaService())
builder.register(Strategy).use(JwtStrategy)

modules.forEach(module => new module(builder).register())

export const container = builder.build()
export { container as iocContainer }
