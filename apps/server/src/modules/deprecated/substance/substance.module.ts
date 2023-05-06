import { DependencyInjectionModule } from '../../../shared/module.js'
import { DumpSubstancesController } from './dump-substances/dump-substances.controller.js'
import { DumpSubstancesService } from './dump-substances/dump-substances.service.js'
import { SearchSubstanceController } from './search-substance/search-substance.controller.js'

export class SubstanceModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(DumpSubstancesService)
		this.containerBuilder.registerAndUse(DumpSubstancesController)
		this.containerBuilder.registerAndUse(SearchSubstanceController)
	}
}
