import { DependencyInjectionModule } from '../shared/common/module/module.js'
import { CreateIngestionService } from './create-ingestion/create-ingestion.service.js'

export class IngestionModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(CreateIngestionService)
	}
}
