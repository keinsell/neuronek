import { DependencyInjectionModule } from '../../shared/module.js'
import { UserController } from './user.controller.js'

export class UserModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(UserController)
	}
}
