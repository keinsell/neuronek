import { theme } from '../theme'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	)
}

export default MyApp
