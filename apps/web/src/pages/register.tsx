import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, Textarea } from '@chakra-ui/react'
import axios from 'axios'
import { Link } from '@chakra-ui/next-js'
import { useRouter } from 'next/router.js'

const RegisterPage = () => {
	const [username, setUsername] = useState('')
	const [publicKey, setPublicKey] = useState('')
	const [error, setError] = useState('')
	const [challengeData, setChallengeData] = useState({})
	const router = useRouter()

	const handleSubmitPublicKey = async () => {
		try {
			const response = await axios.post('http://localhost:1337/user', {
				username: username,
				public_key: publicKey.split('\n').join('\n')
			})

			setError('')

			setChallengeData({
				challengeId: response.data.challange_id,
				message: response.data.message
			})

			// Redirect to SolveChallenge page
			router.push('/solve-challange', {
				query: challengeData
			})
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<Box maxW='md' mx='auto' mt={8} p={4}>
			<Heading mb={4}>Register User</Heading>
			<Text fontSize='lg' mb={4}>
				To register, please provide your PGP public key and decode a message sent to it. A PGP public key is used for
				encrypting messages sent to you. If you don't have a PGP key, you can generate one by following the instructions
				on{' '}
				<Link color='blue.500' href='https://www.gnupg.org/gph/en/manual.html#AEN26'>
					GnuPG's website
				</Link>
				.
			</Text>
			<FormControl mb={4}>
				<FormLabel htmlFor='username'>Username</FormLabel>
				<Input id='username' value={username} onChange={event => setUsername(event.target.value)} />
			</FormControl>
			<FormControl mb={4}>
				<FormLabel htmlFor='public-key'>PGP Public Key</FormLabel>
				<Textarea
					id='public-key'
					value={publicKey}
					onChange={event => setPublicKey(event.target.value)}
					rows={10}
					sx={{
						fontFamily: 'mono',
						fontSize: 'sm',
						padding: '1rem',
						borderRadius: 'md',
						border: '1px solid gray'
					}}
				/>
			</FormControl>
			<Button onClick={handleSubmitPublicKey}>Submit Public Key</Button>
			{error && (
				<Text color='red.500' mt={4}>
					Error: {error}
				</Text>
			)}
		</Box>
	)
}

export default RegisterPage
