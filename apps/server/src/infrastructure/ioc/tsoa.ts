import { IocContainer, IocContainerFactory } from 'tsoa'
import { container } from './container.js'

const iocContainer: IocContainerFactory = (request): IocContainer => {
	return container.get(request)
}

export { iocContainer }
