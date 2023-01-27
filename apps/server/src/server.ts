import express, { Request, Response, json, urlencoded } from 'express'
import { RegisterRoutes } from '../dist/routes'
import openapi from '../dist/swagger.json'
import swaggerUI from 'swagger-ui-express'
import { passport } from './shared/infrastructure/authorization/passport.js'

export const app = express()

app.use(
	urlencoded({
		extended: true
	})
)

app.use(json())
app.use(passport.initialize())

app.use('/docs', swaggerUI.serve, (_req: Request, res: Response) => {
	return res.send(swaggerUI.generateHTML(openapi))
})

RegisterRoutes(app)

export { app as HttpApplication }
