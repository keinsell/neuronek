import { App } from '@tinyhttp/app'
import { json } from 'milliparsec'
import { PrismaClient } from '@prisma/client'
import { createAccount } from './features/account/create-account/create-account.controller.js'

const prisma = new PrismaClient()
const app = new App()

app.use(json())

// Get HEllo world
app.get('/', (req, res) => res.send('Hello World'))

app.post('/account', async (req, res) => {
	return await createAccount(req, res)
})

app.listen(666, () => {
	console.log('Server listening on port 666')
})

export { app as HttpApplication }
