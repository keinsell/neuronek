import express, { json, Request, Response, urlencoded } from 'express'
import swaggerUI from 'swagger-ui-express'
import { RegisterRoutes } from '../dist/routes'
import openapi from '../dist/swagger.json'
import { passport } from './shared/infrastructure/authorization/passport.js'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { ProfilingIntegration } from '@sentry/profiling-node'
import { prisma } from './shared/infrastructure/prisma/prisma.js'

export const app = express()

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
	// Profiling sample rate is relative to tracesSampleRate
	profilesSampleRate: 1.0,

	integrations: [
		new ProfilingIntegration(),
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({ app }),
		new Tracing.Integrations.Prisma({ client: prisma })
	]
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(
	urlencoded({
		extended: true
	})
)

app.use(json())
app.use(passport.initialize())
app.use(cors())

app.use('/docs', swaggerUI.serve, (_req: Request, res: Response) => {
	const docs = swaggerUI.generateHTML(openapi)

	return res.send(docs)
})

RegisterRoutes(app)

// The error handler must be before any other error middleware and after all controllers
app.use(
	Sentry.Handlers.errorHandler({
		shouldHandleError(error) {
			// Capture all 404 and 500 errors
			if (error.status === 404 || error.status === 500) {
				return true
			}
			return false
		}
	})
)

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500
	res.end(res.sentry + '\n')
})

export { app as HttpApplication }
