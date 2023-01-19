export default {
	entry: ['src/index.ts', 'src/shared/*.ts'],
	silent: false,
	splitting: false,
	target: 'node18',
	sourcemap: true,
	dts: true,
	minify: true,
	clean: true,
	treeshake: true,
	loader: {
		'.md': 'text'
	}
}
