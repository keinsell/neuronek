import { DependencyInjectionModule } from '../../shared/common/module/module.js'
import { GetUserController } from './get-user/get-user.controller.js'
import { GetUserService } from './get-user/get-user.service.js'
import { LoginUserController } from './login-user/login-user.controller.js'
import { LoginUserService } from './login-user/login-user.service.js'
import { RegisterUserController } from './register-user/register-user.controller.js'
import { RegisterUserService } from './register-user/register-user.service.js'
import { PrismaUserRepository, UserRepository } from './user.repository.js'

export class UserModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.register(UserRepository).use(PrismaUserRepository)

		this.containerBuilder.registerAndUse(RegisterUserService)
		this.containerBuilder.registerAndUse(LoginUserService)
		this.containerBuilder.registerAndUse(GetUserService)

		this.containerBuilder.registerAndUse(LoginUserController)
		this.containerBuilder.registerAndUse(RegisterUserController)
		this.containerBuilder.registerAndUse(GetUserController)
	}
}
