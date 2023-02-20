import express, { json, Request, Response, urlencoded } from 'express'
import swaggerUI from 'swagger-ui-express'
import { RegisterRoutes } from '../dist/routes'
import openapi from '../dist/swagger.json'
import { passport } from './shared/infrastructure/authorization/passport.js'
import cors from 'cors'

export const app = express()

app.use(
	urlencoded({
		extended: true
	})
)

app.use(json())
app.use(passport.initialize())
app.use(cors())

app.use('/docs', swaggerUI.serve, (_req: Request, res: Response) => {
	return res.send(swaggerUI.generateHTML(openapi))
})

RegisterRoutes(app)

export { app as HttpApplication }
