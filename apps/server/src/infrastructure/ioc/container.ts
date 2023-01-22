import diod from 'diod'
import { HelloWorldService } from '../../hello-routing/hello-world.service.js'
import { HelloWorldController } from '../../hello-routing/hello-world.controller.js'

const builder = new diod.ContainerBuilder()

builder.registerAndUse(HelloWorldService)
builder.registerAndUse(HelloWorldController)

export const container = builder.build()
