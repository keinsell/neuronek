import 'reflect-metadata'
import { createExpressServer, useContainer } from 'routing-controllers'
import { HelloWorldController } from './hello-routing/hello-world.controller.js'
import { container } from './infrastructure/ioc/container.js'
import { DiodAdapter } from './infrastructure/ioc/routing-controllers.js'

useContainer(new DiodAdapter(container))

createExpressServer({
	controllers: [HelloWorldController]
}).listen(3000)
