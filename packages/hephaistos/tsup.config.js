export default {
  entry: ['src/index.ts'],
  silent: false,
  splitting: true,
  target: 'node18',
  sourcemap: true,
  dts: true,
  minify: true,
  format: ['esm'],
  clean: true,
  treeshake: true,
  metafile: true,
  shims: true,
  loader: {
    '.md': 'file'
  }
}
