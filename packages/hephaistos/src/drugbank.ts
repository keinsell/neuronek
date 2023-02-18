import { PrismaClient, Prisma } from 'database'
import dataset, { DrugElement, DrugbankD } from 'drugbank-dataset'
import slugify from 'slugify'
import { prisma } from './prisma-instance.js'
import ora from 'ora'

function map(substance: DrugElement): Prisma.SubstanceCreateInput {
	return {
		name: substance.name
		// cas_number: substance['cas-number'] || undefined
	}
}

async function doSubstanceExistsByName(name: string) {
	const exists = await prisma.substance.count({ where: { name } })
	return exists > 0
}

export async function drugbank(): Promise<void> {
	const spinner = ora(`Loading drugbank.json...`).start()

	let index = 0

	for (const item of dataset as unknown as any[]) {
		const substance = map(item)
		spinner.text = `Importing substance: ${substance.name} - (${index++}/${(dataset as unknown as any[]).length - 1})`

		if (!substance.name.startsWith('Vitamin')) {
			// Skip
			continue
		}

		const substanceExists = await doSubstanceExistsByName(substance.name)

		if (substanceExists) {
			// Update Substance
			await prisma.substance.update({ where: { name: substance.name }, data: substance })
			// Skip creation
			continue
		}

		await prisma.substance.create({ data: substance })
	}

	spinner.succeed('Drugbank loaded to database...')
}
