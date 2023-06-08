#!/usr/bin/env node
import { HttpApplication } from '../dist/index.js'

HttpApplication.listen(Number(process.env.PORT)).on('listening', () => {
  const url = `${process.env.API_URL}`
  console.log(`🚀 Server started at ${url}/docs`)
})
