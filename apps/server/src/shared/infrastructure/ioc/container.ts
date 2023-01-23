import diod from 'diod'
import { HelloWorldService } from '../../../hello-routing/hello-world.service.js'
import { HelloWorldController } from '../../../hello-routing/hello-world.controller.js'
import { TestController } from '../../../hello-routing/test.controller.js'
import { PrismaService } from '../prisma/prisma.js'
import { DependencyInjectionModule } from '../../common/module/module.js'
import { UserModule } from '../../../modules/user/user.module.js'

const builder = new diod.ContainerBuilder()

// TODO: Find a good way to minimalise this file, probably some xyz.module.ts files that will hold dependency injection infomrmation, then we could just import modules.

const modules: DependencyInjectionModule[] = [new UserModule(builder)]

builder.register(PrismaService).useInstance(new PrismaService())

builder.registerAndUse(HelloWorldService)
builder.registerAndUse(HelloWorldController)
builder.registerAndUse(TestController)

modules.forEach(module => module.register())

export const container = builder.build()
export { container as iocContainer }
