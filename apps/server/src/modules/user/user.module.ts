import { DependencyInjectionModule } from '../../shared/common/module/module.js'
import { GetUserController } from './usecases/get-user/get-user.controller.js'
import { GetUserService } from './usecases/get-user/get-user.service.js'
import { LoginUserController } from './usecases/login-user/login-user.controller.js'
import { LoginUserService } from './usecases/login-user/login-user.service.js'
import { RegisterUserController } from './usecases/register-user/register-user.controller.js'
import { RegisterUserService } from './usecases/register-user/register-user.service.js'
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
