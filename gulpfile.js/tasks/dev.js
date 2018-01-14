module.exports = function() {
	require('gulp').task('dev', ['server', 'scripts', 'html', 'assets', 'styles', 'watch']);
}
