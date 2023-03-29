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
	substance.chemical_class = input.class?.chemical?.[0] || undefined
	substance.psychoactive_class = input.class?.psychoactive || undefined

	return substance as any
}

function mapRoutesOfAdministration(input: PsychonautWikiSubstance): Prisma.RouteOfAdministrationCreateInput[] {
	const mappedRoutesOfAdministration: Prisma.RouteOfAdministrationCreateInput[] = []

	for (const route of input.roas) {
		if (route.dose) {
			if (
				!route.dose.threshold ||
				!route.dose.light ||
				!route.dose.common ||
				!route.dose.strong ||
				!route.dose.heavy ||
				!route.dose.units
			) {
				continue
			}
		} else {
			continue
		}

		if (route) {
			mappedRoutesOfAdministration.push({
				name: route.name,
				thereshold_dosage: route.dose.threshold,
				light_dosage: [route.dose.light.min, route.dose.light.max],
				common_dosage: [route.dose.common.min, route.dose.common.max],
				strong_dosage: [route.dose.strong.min, route.dose.strong.max],
				heavy_dosage: route.dose.heavy,
				dosage_unit: route.dose.units,
				dosage_kind: '',
				Substance: {
					connect: {
						name: input.name
					}
				}
			})
		}
	}

	return mappedRoutesOfAdministration
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
		const routesOfAdministration = mapRoutesOfAdministration(psx)

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

		// Create missing routes of administration
		for (const route of routesOfAdministration) {
			// Check if route of administration exists already, skip
			if (
				(await prisma.routeOfAdministration.count({ where: { name: route.name, substanceName: substance.name } })) > 0
			) {
				continue
			}
			// Create route of administration
			await prisma.routeOfAdministration.create({
				data: {
					...route,
					Substance: {
						connect: {
							name: substance.name
						}
					}
				}
			})
		}
	}

	spinner.succeed('Psychonautwiki loaded to database...')
}
