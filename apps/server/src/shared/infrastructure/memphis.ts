import { memphis } from 'memphis-dev'



export const memphisConnection = await memphis.connect({
	host: 'localhost',
	username: 'root',
	password: 'memphis'
})
