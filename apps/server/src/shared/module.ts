import diod, { ContainerBuilder } from 'diod'

/**
 * This class tries to copy app.module.ts from Nest.js, but based on diod
 */
export abstract class DependencyInjectionModule {
	public readonly containerBuilder: diod.ContainerBuilder

	constructor(builder: ContainerBuilder) {
		this.containerBuilder = builder
	}

	abstract register(): void
}
