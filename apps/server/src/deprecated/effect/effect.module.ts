import { DependencyInjectionModule } from '../shared/common/module/module.js'
import { DumpEffectsController } from './dump-effects/dump-effects.controller.js'
import { DumpEffectsService } from './dump-effects/dump-effects.service.js'
import { SearchEffectController } from './search-effect/search-effect.controller.js'

export class EffectModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(DumpEffectsService)
		this.containerBuilder.registerAndUse(DumpEffectsController)
		this.containerBuilder.registerAndUse(SearchEffectController)
	}
}
