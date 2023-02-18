import { request } from 'graphql-request'
import {
	AllSubstancesDocument,
	AllSubstancesQuery,
	Substance as PsychonautWikiSubstance
} from './utils/gql/sdk/graphql.js'
import { Prisma } from 'database'
import { prisma } from './prisma-instance.js'
import ora from 'ora'

function map(input: PsychonautWikiSubstance): Prisma.SubstanceCreateInput {
	const substance: Partial<Prisma.SubstanceCreateInput> = {}

	substance.name = input.name
	substance.common_names = input.commonNames || undefined

	return substance as any
}

async function doSubstanceExistsByName(name: string) {
	const exists = await prisma.substance.count({ where: { name } })
	return exists > 0
}

export async function psychonautwiki() {
	const response = await request<AllSubstancesQuery>('https://api.psychonautwiki.org', AllSubstancesDocument, {})

	const spinner = ora('Loading PsychonautWiki').start()

	// Loop through response substances
	for (const psx of response.substances) {
		// Map to database API
		const substance = map(psx)

		spinner.text = `Loading ${substance.name}...`

		// Check if substance exists already, skip
		if (await doSubstanceExistsByName(substance.name)) {
			// Update substance
			await prisma.substance.update({
				where: { name: substance.name },
				data: substance
			})
			// Skip creation
			continue
		}

		// Write to database
		await prisma.substance.create({ data: substance })
	}

	spinner.succeed('Psychonautwiki loaded to database...')
}
