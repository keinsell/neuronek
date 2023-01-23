import diod from 'diod'
import { HelloWorldService } from '../../hello-routing/hello-world.service.js'
import { HelloWorldController } from '../../hello-routing/hello-world.controller.js'
import { TestController } from '../../hello-routing/test.controller.js'
import { PrismaService } from '../prisma/prisma.js'
import { UserRepository } from '../../modules/user/user.repository.js'

const builder = new diod.ContainerBuilder()

builder.register(PrismaService).useInstance(new PrismaService())

builder.registerAndUse(HelloWorldService)
builder.registerAndUse(HelloWorldController)
builder.registerAndUse(TestController)

builder.registerAndUse(UserRepository)

export const container = builder.build()
export { container as iocContainer }
