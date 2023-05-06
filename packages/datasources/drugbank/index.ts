import { createReadStream, statSync, createWriteStream } from 'fs'
const jsonStream = require('JSONStream')
import prettyBytes from 'pretty-bytes'
import { DrugbankD } from './@types/drugbank'
import ora from 'ora'

// Read 1GB Json File called 'drugbank.json' and console.log every drug name which is available under following keys drugbank > drugs > drug > name.

async function main() {
	const readableStream = createReadStream('dataset/drugbank2.json')
	const totalFileSizeInBytes = statSync('dataset/drugbank2.json').size

	let filesize = 0

	const spinner = ora(`Loading drugbank.json (${prettyBytes(totalFileSizeInBytes)})`).start()

	readableStream.on('data', chunk => {
		filesize += chunk.length

		spinner.text = `Loading drugbank.json (${prettyBytes(filesize)}/${prettyBytes(totalFileSizeInBytes)}) (${Math.floor(
			(100 * filesize) / totalFileSizeInBytes
		)}%)`
	})

	readableStream.on('end', () => {
		spinner.succeed(`Successfully loaded drugbank.json`).stopAndPersist().clear()
	})

	// Perform operations on available dataset.
	const parser = jsonStream.parse()

	await parser.on('data', async (data: DrugbankD) => {
		console.log(`Found ${data.drugbank.drug.length} drugs.`)

		const substances = []

		// Emit substances one by one.
		for (const drug of data.drugbank.drug) {
			// Extract only necessary information from the dataset.
			substances.push({
				name: drug.name
			})
		}

		console.log(`Found ${substances.length} substances.`)
		console.log(substances)

		const writeStream = createWriteStream('dataset/drugbank.json')
		writeStream.write(JSON.stringify(substances))
	})

	parser.on('end', () => {
		console.log('Parsed drugbank.json file.')
	})

	await readableStream.pipe(parser)
}

main()
