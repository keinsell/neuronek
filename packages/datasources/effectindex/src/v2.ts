// 1. Get sitemap and covert it to JSON
// 2. Find all urs that contain /effect/
// 3. Fetch each url individually
// 3.1 Make readable version of page with https://github.com/mozilla/readability
// 3.2 Extract title from document
// 3.3 Extract content from document, transform it to Markdown and save into JSON
// https://effectindex.com
import Parser from '@postlight/parser'

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

export interface Page {
	title: string
	author?: null
	date_published?: null
	dek?: null
	lead_image_url?: null
	content: string
	next_page_url?: null
	url: string
	domain: string
	excerpt: string
	word_count: number
	direction: string
	total_pages: number
	rendered_pages: number
}

async function main() {
	// 1. Get sitemap and covert it to JSON
	const sitemapXml = await fetch('https://effectindex.com/sitemap.xml').then(r => r.text())

	console.log(sitemapXml)

	let sitemap: Sitemap | undefined

	// 1.1 Convert XML to JSON
	let parseString = require('xml2js').parseString

	sitemap = await new Promise((resolve, reject) => {
		parseString(sitemapXml, (err: any, result: any) => resolve(result))
	})

	if (!sitemap) return

	console.log(sitemap)

	// 2. Filter urls to only ones that are responsible for effect posts
	const sitemapUrls = sitemap?.urlset.url
	const effectPostsUrls = []

	for (const url of sitemapUrls) {
		const { loc } = url
		if (loc && loc[0] && loc[0].includes('/effects/')) {
			effectPostsUrls.push(loc[0])
		}
	}

	console.log(effectPostsUrls)

	// 3. Crawl each url that contains a post

	const pages: Page[] = []

	for await (const url of effectPostsUrls) {
		const content: Page = await Parser.parse(url, { contentType: 'text' })
		console.log(content)
		pages.push(content)
	}

	return pages
}

main()
