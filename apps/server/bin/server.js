#!/usr/bin/env node

import { HttpApplication } from '../dist/index.js'

HttpApplication.listen(Number(process.env.PORT)).on('listening', () =>
	console.log(`Server started on ${process.env.API_URL}/docs`)
)
