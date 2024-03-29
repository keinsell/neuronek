module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:unicorn/recommended',
		'plugin:node/recommended',
		'plugin:sonarjs/recommended',
		'plugin:diff/diff',
		'plugin:jsdoc/recommended',
		'plugin:@typescript-eslint/recommended'
	],
	plugins: ['json-format', 'sonarjs', 'jsdoc', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	settings: {
		'json/sort-package-json': 'standard',
		'json/ignore-files': ['**/package-lock.json'],
		'json/json-with-comments-files': ['**/tsconfig.json', '.vscode/**']
	},
	rules: {
		'node/exports-style': ['error', 'module.exports'],
		'node/no-missing-import': 'off',
		'node/file-extension-in-import': ['error', 'always'],
		'node/prefer-global/buffer': ['error', 'always'],
		'node/prefer-global/console': ['error', 'always'],
		'node/prefer-global/process': ['error', 'always'],
		'node/prefer-global/url-search-params': ['error', 'always'],
		'node/prefer-global/url': ['error', 'always'],
		'node/prefer-promises/dns': 'error',
		'node/prefer-promises/fs': 'error',
		'node/no-unsupported-features/es-syntax': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/prefer-namespace-keyword': 'off'
	}
}
