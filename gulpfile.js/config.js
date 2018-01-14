module.exports = {

	src: 'src',

	build: 'build',

	scripts: {
		src: ['src/**/*.js'],

		entrypoint: 'src/index.js',

		environment: require('../.env.js')
	},

	assets: {
		src: 'src/assets/**/*'
	},

	server: {
		port: 8600
	},


	html: {
		src: 'src/**/*.html',
	},

	styles: {
		entrypoint: 'src/styles/index.less',

		src: ['src/styles/**/*.less']
	}

}
