import { DependencyInjectionModule } from '../../shared/common/module/module.js'
import { LoginUserController } from './login-user/login-user.controller.js'
import { LoginUserService } from './login-user/login-user.service.js'
import { RegisterUserController } from './register-user/register-user.controller.js'
import { RegisterUserService } from './register-user/register-user.service.js'
import { PrismaUserRepository, UserRepository } from './user.repository.js'

export class UserModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(RegisterUserService)
		this.containerBuilder.registerAndUse(LoginUserService)
		this.containerBuilder.registerAndUse(RegisterUserController)
		this.containerBuilder.registerAndUse(LoginUserController)
		this.containerBuilder.register(UserRepository).use(PrismaUserRepository)
	}
}
