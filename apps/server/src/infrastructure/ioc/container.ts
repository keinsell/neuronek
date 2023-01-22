import diod from 'diod'
import { HelloWorldService } from '../../hello-routing/hello-world.service.js'
import { HelloWorldController } from '../../hello-routing/hello-world.controller.js'
import { TestController } from '../../hello-routing/test.controller.js'

const builder = new diod.ContainerBuilder()

builder.registerAndUse(HelloWorldService)
builder.registerAndUse(HelloWorldController)
builder.registerAndUse(TestController)

export const container = builder.build()
export { container as iocContainer }
