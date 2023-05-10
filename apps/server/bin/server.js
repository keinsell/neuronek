#!/usr/bin/env node

import { HttpApplication } from '../dist/index.js'
import chalk from 'chalk'

HttpApplication.listen(Number(process.env.PORT)).on('listening', () => {
	const url = `${process.env.API_URL}`
	console.log(chalk.green(`🚀 Server started at ${chalk.blueBright(url)}`))
})
