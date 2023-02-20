import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'

const SolveChallenge = () => {
	const router = useRouter()
	const { challangeId, message } = router.query
	const [encodedMessage, setEncodedMessage] = useState(message)
	const [decodedMessage, setDecodedMessage] = useState('')
	const [error, setError] = useState('')

	console.log(message)
	console.log(challangeId)

	useEffect(() => {
		setEncodedMessage(message as string)
	}, [message])

	const handleSubmitDecodedMessage = async () => {
		try {
			// send decoded message to server for validation
			setError('')
		} catch (err) {
			setError(err.message)
		}
	}

	// TODO: Fetch authorization challenge before page loads

	return (
		<Box maxW='md' mx='auto' mt={8} p={4}>
			<Heading mb={4}>Solve Challenge</Heading>
			<Text fontSize='lg' mb={4}>
				To complete your registration, please decode the following message using your PGP private key:
			</Text>
			<Textarea
				value={encodedMessage}
				onChange={event => setEncodedMessage(event.target.value)}
				isReadOnly
				sx={{
					fontFamily: 'mono',
					fontSize: 'sm',
					padding: '1rem',
					borderRadius: 'md',
					border: '1px solid gray'
				}}
			/>
			<FormControl mt={4}>
				<FormLabel htmlFor='decoded-message'>Decoded Message Content</FormLabel>
				<Input id='decoded-message' value={decodedMessage} onChange={event => setDecodedMessage(event.target.value)} />
			</FormControl>
			<Button mt={4} onClick={handleSubmitDecodedMessage}>
				Submit Decoded Message
			</Button>
			{error && (
				<Text color='red.500' mt={4}>
					Error: {error}
				</Text>
			)}
		</Box>
	)
}

export default SolveChallenge
