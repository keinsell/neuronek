import { prisma } from '../../shared/infrastructure/prisma/prisma.js'
import { createAccount } from './routes/account/account.post.js'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'
import * as Tracing from '@sentry/tracing'
import express, { Application } from 'express'
import { json } from 'milliparsec'

const app: Application = express()

Sentry.init({
	dsn: process.env['SENTRY_DSN']!,
	tracesSampleRate: 1.0,
	profilesSampleRate: 1.0,

	integrations: [
		new ProfilingIntegration(),
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
		new Tracing.Integrations.Prisma({ client: prisma })
	]
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(json())

app.post('/account', async (req, res) => {
	return await createAccount(req, res)
})

export { app as HttpApplication }
