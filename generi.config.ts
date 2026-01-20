export default {
	repository: 'https://github.com/ZEXagonal-mente/nvton',
	silent: false,
	commits: 'conventional-commits',
	tag: true,
	version: true,
	push: true,
	release: false,
	publish: false,
	exclude: [' typo'],
	prerelease: 'beta',
	packagePath: 'package.json',
	lernaPath: 'lerna.json',
};
