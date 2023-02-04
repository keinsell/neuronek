import { DependencyInjectionModule } from '../../shared/common/module/module.js'
import { GetEffectsController } from './get-effects/get-effects.controller.js'
import { GetEffectsService } from './get-effects/get-effects.service.js'

export class EffectModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(GetEffectsService)
		this.containerBuilder.registerAndUse(GetEffectsController)
	}
}
