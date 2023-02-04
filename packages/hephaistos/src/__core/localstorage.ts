import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

/**
 * This is a class that implements a local storage repository using the lowdb library in node.js. The lowdb library is a simple and fast NoSQL database that stores data as a JSON file on disk.
 */
export abstract class LocalStorageRepository<DOMAIN_MODEL, STORAGE_MODEL> {
	public low: Low<STORAGE_MODEL[]>
	private adapter: JSONFile<STORAGE_MODEL[]>

	constructor(file: string) {
		this.adapter = new JSONFile<STORAGE_MODEL[]>(file ?? 'db.json')
		this.low = new Low(this.adapter)
	}

	abstract toDomain(storage: STORAGE_MODEL): DOMAIN_MODEL
	abstract toStorage(model: DOMAIN_MODEL): STORAGE_MODEL

	abstract exists(model: DOMAIN_MODEL): Promise<boolean>
	abstract getIndex(model: DOMAIN_MODEL): Promise<number | undefined>

	/** The "save" method is used to save an instance of the domain model to the local storage. The method first reads the existing data, creates an empty array if there is no data, checks if the model already exists in the storage, removes the existing instance of the model if it does, and then pushes the fromDomainModel(model) to the lowdb data array. The method writes the data to the storage file using low.write(). */
	public async save(model: DOMAIN_MODEL) {
		await this.low.read()
		// console.log(`LocalStorageRepository.save()`, model)

		// Create an empty array if the storage file is empty.
		if (!this.low.data) {
			this.low.data = []
			await this.low.write()
		}

		// Map the storage model to the domain model using the toDomainModel method.
		const storageModel = this.toStorage(model)

		// Check if the model exists in storage. If it does, remove the existing model.
		const index = await this.getIndex(model)

		if (index !== undefined && index !== -1) {
			console.log('LocalStorageRepository.save(): Removing existing model from storage...')
			this.low.data.splice(index, 1)
		}

		// Push the new model into the data array and write it to the storage file.
		console.log(`LocalStorageRepository.save(): Saving model to storage.`)
		console.log(storageModel)
		await this.low.data.push(storageModel)
		await this.low.write()

		return model
	}

	/** The "all" method is used to retrieve all instances of the domain model from the storage. The method reads the data from the storage file and maps the storage model to the domain model using the toDomainModel method. */
	public async all() {
		await this.low.read()

		const storageModels = this.low.data || []
		const domainModels: DOMAIN_MODEL[] = []

		for (const model of storageModels) {
			const domainModel = this.toDomain(model)
			domainModels.push(domainModel)
		}

		return domainModels
	}

	public async count(): Promise<number> {
		await this.low.read()

		// Create an empty array if the storage file is empty.
		if (!this.low.data) {
			this.low.data = []
			await this.low.write()
		}

		return this.low.data.length
	}

	public async forceWriteAll(models: DOMAIN_MODEL[]) {
		await this.low.read()
		const storageModels: STORAGE_MODEL[] = models.map(this.toStorage)

		this.low.data = [...storageModels]

		await this.low.write()
	}
}
