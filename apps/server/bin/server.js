#!/usr/bin/env node

import { HttpApplication } from '../dist/index.js'

HttpApplication.listen(3000).on('listening', () => console.log('Server started on http://localhost:3000/docs'))
