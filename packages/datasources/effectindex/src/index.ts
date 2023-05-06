// 1. Get sitemap and covert it to JSON
// 2. Find all urs that contain /effect/
// 3. Fetch each url individually
// 3.1 Make readable version of page with https://github.com/mozilla/readability
// 3.2 Extract title from document
// 3.3 Extract content from document, transform it to Markdown and save into JSON
import chalk from 'chalk'
import figlet from 'figlet'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import puppeteer from 'puppeteer'
import signale from 'signale'
import unfluff from 'unfluff'

figlet('Effectindex', function (err, data) {
	if (err) return console.log(err)
	console.log(data)
})

// https://effectindex.com

type Sitemap = {
	urlset: {
		$: {
			xmlns: string
			'xmlns:news': string
			'xmlns:xhtml': string
			'xmlns:mobile': string
			'xmlns:image': string
			'xmlns:video': string
		}
		url: Array<{
			loc: string
			lastmod?: string
			changefreq?: string
			priority?: string
			['news:news']?: {
				['news:publication']?: {
					['news:name']: string
					['news:language']: string
				}
				['news:publication_date']: string
				['news:title']: string
			}
			['image:image']?: Array<{
				['image:loc']: string
				['image:caption']?: string
				['image:geo_location']?: string
				['image:title']?: string
				['image:license']?: string
			}>
			['video:video']?: {
				['video:thumbnail_loc']: string
				['video:title']: string
				['video:description']: string
				['video:content_loc']: string
				['video:player_loc']?: {
					$: {
						allow_embed: string
						autoplay: string
					}
					_: string
				}
				['video:duration']?: string
				['video:expiration_date']?: string
				['video:rating']?: string
				['video:view_count']?: string
				['video:publication_date']?: string
				['video:family_friendly']?: string
				['video:tag']?: string | Array<string>
				['video:category']?: string | Array<string>
				['video:restriction']?: {
					$: {
						relationship: string
						type: string
					}
					_: string
				}
				['video:gallery_loc']?: {
					$: {
						title: string
					}
					_: string
				}
				['video:price']?: {
					$: {
						currency: string
						type: string
						resolution: string
						rental_duration: string
					}
					_: string
				}
				['video:requires_subscription']?: string
				['video:uploader']?: {
					$: {
						info: string
					}
					_: string
				}
				['video:platform']?: string | Array<string>
				['video:live']?: string
			}
		}>
	}
}

type ParsedPage = {
	url?: string
	title: string
	softTitle: string
	date: null
	author: string[]
	publisher: string
	copyright: string
	favicon: string
	description: string
	keywords: string[]
	lang: string
	canonicalLink: string
	tags: []
	image: string
	videos: []
	links: [
		{
			text: string
			href: string
		}
	]
	text: string
}

async function main() {
	// 1. Get sitemap and covert it to JSON
	const sitemapXml = await fetch('https://effectindex.com/sitemap.xml').then(r => r.text())

	let sitemap: Sitemap | undefined

	// 1.1 Convert XML to JSON
	let parseString = require('xml2js').parseString

	sitemap = await new Promise((resolve, reject) => {
		parseString(sitemapXml, (err: any, result: any) => resolve(result))
	})

	if (!sitemap) return

	signale.success(`Downloaded ${chalk.grey('sitemap.xml')}`)

	// 2. Filter urls to only ones that are responsible for effect posts
	const sitemapUrls = sitemap?.urlset.url
	const effectPostsUrls = []

	for (const url of sitemapUrls) {
		const { loc } = url
		if (loc && loc[0] && loc[0].includes('/effects/')) {
			effectPostsUrls.push(loc[0])
		}
	}

	signale.success(`Extracted ${chalk.yellow(effectPostsUrls.length - 1)} urls.`)

	// Prepare LowDB

	const low = new LowSync<ParsedPage[]>(new JSONFileSync('effectindex.json'))

	// Validate if cache exists
	low.read()

	if (low.data && low.data.length > 40) {
		signale.success(`Found ${chalk.yellow(low.data.length)} in cache.`)
		return low.data
	}

	low.data = []
	low.write()

	let i = 0

	// 3. Crawl each url that contains a post

	const browser = await puppeteer.launch()

	for await (const url of effectPostsUrls) {
		// 3.1 Get Page HTML
		const page = await browser.newPage()
		await page.goto(url, { waitUntil: 'networkidle2' })
		const html = await page.content()

		// 3.2 Make HTML Readable
		const data = unfluff(html) as ParsedPage

		// If title is "Effect Index", then take a first world in description as title
		if (data.title === 'Effect Index') {
			const description = data.description.split(' ')
			data.title = description[0]
		}

		data.title === 'An' ? (data.title = 'Epileptic seizure') : data.title
		data.title === 'Watery' ? (data.title = 'Watery eyes') : data.title
		data.title === 'Visual' ? (data.title = 'Visual haze') : data.title
		data.title === 'Pain' ? (data.title = 'Pain relief') : data.title
		data.title === 'Ego' ? (data.title = 'Ego death') : data.title
		data.title === 'Dry' ? (data.title = 'Dry mouth') : data.title
		data.title === 'A' ? (data.title = 'Runny nose') : data.title
		data.title === 'Déjà' ? (data.title = 'Déjà Vu') : data.title
		data.title === 'Brain' ? (data.title = 'Brain zaps') : data.title
		data.title === 'Back' ? (data.title = 'Back pain') : data.title

		data.url = url

		low.data.push(data)

		signale.success(
			`Parsed "${chalk.grey(data.title)}" page ${chalk.yellow(i++)} of ${effectPostsUrls.length - 1} (${(
				(i / (effectPostsUrls.length - 1)) *
				100
			).toFixed(1)}%)`
		)

		// 3.3 Close Puppeteer Page
		await page.close()
		low.write()
	}

	browser.close()

	return low.data
}

main()
