import { EffectRepository, PrismaClient, SubstanceRepository } from 'database'
import { HephaistosDataset } from 'src/main.js'

export abstract class DatabaseSyncAdapter {
	abstract sync(dataset: HephaistosDataset): Promise<void>
}

export class PrismaDatabaseSync implements DatabaseSyncAdapter {
	private connection = new PrismaClient()
	private effectRepository = new EffectRepository(this.connection)
	private substanceRepository = new SubstanceRepository(this.connection)

	async sync(dataset: HephaistosDataset): Promise<void> {
		await this.connection.$connect()

		for (const effect of dataset.effect_store) {
			console.log(`Syncing effect with slug ${effect.slug}...`)
			await this.effectRepository.save(effect)
		}

		for (const substance of dataset.substance_store) {
			console.log(`Syncing substance with slug ${substance.name}...`)
			await this.substanceRepository.save(substance)
		}

		await this.connection.$disconnect()
	}
}
