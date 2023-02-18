import { PrismaClient, Prisma } from 'database'
import type { ParsedPage } from 'effectindex-dataset'
import dataset from 'effectindex-dataset'
import slugify from 'slugify'
import { prisma } from './prisma-instance.js'
import ora from 'ora'

function map(effect: ParsedPage & { url: string }): Prisma.EffectCreateInput {
	let title = effect.title
	const summary = effect.description
	const raw_description = effect.text.split('\n')
	const url = effect.url
	const description = []

	title === 'An' ? (title = 'Epileptic seizure') : title
	title === 'Watery' ? (title = 'Watery eyes') : title
	title === 'Visual' ? (title = 'Visual haze') : title
	title === 'Pain' ? (title = 'Pain relief') : title
	title === 'Ego' ? (title = 'Ego death') : title
	title === 'Dry' ? (title = 'Dry mouth') : title
	title === 'A' ? (title = 'Runny nose') : title
	title === 'Déjà' ? (title = 'Déjà Vu') : title
	title === 'Brain' ? (title = 'Brain zaps') : title
	title === 'Back' ? (title = 'Back pain') : title

	for (const line of raw_description) {
		if (line.startsWith('[')) continue
		if (line === '') continue

		description.push(line)
	}

	return {
		name: title,
		slug: slugify(title, { lower: true }),
		summary,
		description,
		effectindex: url
	}
}

async function checkIfEffectExistsByName(name: string) {
	const effect = prisma.effect.findFirst({ where: { name } })
	return effect
}

export async function effectindex(): Promise<void> {
	const spinner = ora(`Loading effectindex.json...`).start()

	let index = 0
	for (const item of dataset) {
		const effect = map(item as ParsedPage & { url: string })
		spinner.text = `Importing effect: ${effect.name} - (${index++}/${dataset.length - 1})`

		const effectExists = await checkIfEffectExistsByName(effect.name)

		if (effectExists) {
			continue
		}

		await prisma.effect.create({ data: effect })
	}

	spinner.succeed('Effectindex loaded to database...')
}
