import { Entity } from '../../shared/common/domain/enity.js'
import { Password } from './password/password.vo.js'

export interface UserProperties {
	username: string
	password: Password
}

export class User extends Entity implements UserProperties {
	public readonly username: string
	public readonly password: Password

	constructor(properties: UserProperties) {
		super()
		Object.assign(this, properties)
	}
}
