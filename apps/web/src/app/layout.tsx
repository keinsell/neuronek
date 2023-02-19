'use client'

import './globals.css'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>
				{' '}
				<CacheProvider>
					<ChakraProvider>{children}</ChakraProvider>
				</CacheProvider>
			</body>
		</html>
	)
}
