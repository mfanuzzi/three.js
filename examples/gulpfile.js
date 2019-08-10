var gulp = require('gulp');

gulp.task('default',
	gulp.series('js-build')//, 'js-vendor');
);

//JS
gulp.task('js-build', function () {
	return gulp.src('./js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./concat.js'));
});
