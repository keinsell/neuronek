import { EffectRepository, PrismaClient } from 'database'
import { HephaistosDataset } from 'src/main.js'

export abstract class DatabaseSyncAdapter {
	abstract sync(dataset: HephaistosDataset): Promise<void>
}

export class PrismaDatabaseSync implements DatabaseSyncAdapter {
	private connection = new PrismaClient()
	private effectRepository = new EffectRepository(this.connection)

	async sync(dataset: HephaistosDataset): Promise<void> {
		await this.connection.$connect()

		for (const effect of dataset.effect_store) {
			console.log(`Syncing effect with slug ${effect.slug}...`)
			await this.effectRepository.save(effect)
		}

		await this.connection.$disconnect()
	}
}
