import { App } from '@tinyhttp/app'
import { json } from 'milliparsec'
import { PrismaClient } from '@prisma/client'
import { createAccount } from './features/account/create-account/create-account.controller.js'
import { defineNewAuthChallenge } from './features/authorization/create-authorization-challenge/createAuthChallenge.js'

const prisma = new PrismaClient()
const app = new App()

app.use(json())

// Get HEllo world
app.get('/', (req, res) => res.send('Hello World'))

app.post('/account', async (req, res) => {
	return await createAccount(req, res)
})

app.get('/challange/:username', async (req, res) => {
	return await defineNewAuthChallenge(req, res)
})

app.listen(666, () => {
	console.log('Server listening on port 666')
})

export { app as HttpApplication }
