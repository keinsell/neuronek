import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
	colors: {
		gray: {
			50: '#f6f6f6',
			100: '#e8e8e8',
			200: '#d0d0d0',
			300: '#b9b9b9',
			400: '#a3a3a3',
			500: '#8c8c8c',
			600: '#707070',
			700: '#515151',
			800: '#3b3b3b',
			900: '#212121'
		},
		black: '#000000',
		white: '#ffffff',
		primary: '#000000',
		secondary: '#ffffff'
	},
	fonts: {
		body: 'Inter, sans-serif',
		heading: 'Inter, sans-serif',
		mono: 'Inconsolata, monospace'
	},
	fontSizes: {
		xs: '12px',
		sm: '14px',
		md: '16px',
		lg: '18px',
		xl: '20px',
		'2xl': '24px',
		'3xl': '30px',
		'4xl': '36px',
		'5xl': '48px',
		'6xl': '64px'
	},
	fontWeights: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700
	}
})

export { theme }
