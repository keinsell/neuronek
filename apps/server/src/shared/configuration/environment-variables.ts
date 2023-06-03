import { cleanEnv, host, port, str } from 'envalid'
import { nanoid }                    from 'nanoid'



const env = cleanEnv(process.env, {
	NODE_ENV: str({
		default: 'development',
		choices: ['development', 'production']
	}),
	PROTOCOL: str({
		default: 'http'
	}),
	HOST: host({
		default: 'localhost'
	}),
	PORT: port({
		default: 3000
	}),
	JWT_SECRET: str({
		devDefault: nanoid(512)
	})
})

export const NODE_ENV = env.NODE_ENV
export const HOST = env.HOST
export const PORT = env.PORT
export const PROTOCOL = env.PROTOCOL
export const JWT_SECRET = env.JWT_SECRET
