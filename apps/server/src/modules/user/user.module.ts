import { DependencyInjectionModule } from '../../shared/common/module/module.js'
import { RegisterUserController } from './register-user/register-user.controller.js'
import { RegisterUserService } from './register-user/register-user.service.js'
import { InMemoryUserRepository, UserRepository } from './user.repository.js'

export class UserModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(RegisterUserService)
		this.containerBuilder.registerAndUse(RegisterUserController)
		this.containerBuilder.register(UserRepository).use(InMemoryUserRepository)
	}
}
