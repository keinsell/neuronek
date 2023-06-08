export default {
	entry: ['src/index.ts'],
	silent: true,
	splitting: true,
	target: 'node19',
	sourcemap: true,
	dts: true,
	minify: false,
	format: ['esm'],
	clean: false,
	treeshake: true,
	metafile: true,
	shims: true,
	loader: {
		'.md': 'file'
	},
	plugins: []
}
