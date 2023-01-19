export default {
	entry: ['src/index.ts', 'src/shared/*.ts'],
	silent: false,
	splitting: true,
	target: 'node18',
	sourcemap: true,
	dts: true,
	minify: false,
	clean: false,
	treeshake: true,
	loader: {
		'.md': 'text'
	}
}
