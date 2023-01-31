export type ParsedPage = {
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

declare const dataset: ParsedPage[]

export default dataset
