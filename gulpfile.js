const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

const jsList = [
//	'./examples/js/three.min.js',
	'./examples/js/libs/ammo.js',
	'./examples/js/controls/OrbitControls.js',
	'./examples/js/utils/BufferGeometryUtils.js',
	'./examples/js/WebGL.js',
	'./examples/js/loaders/GLTFLoader.js',
	'./examples/js/postprocessing/EffectComposer.js',
	'./examples/js/postprocessing/RenderPass.js',
	'./examples/js/postprocessing/ShaderPass.js',
	'./examples/js/postprocessing/HalftonePass.js',
	'./examples/js/postprocessing/AfterimagePass.js',
	'./examples/js/shaders/CopyShader.js',
	'./examples/js/shaders/HalftoneShader.js',
	'./examples/js/shaders/AfterimageShader.js',
	'./examples/js/geometries/ConvexGeometry.js',
	'./examples/js/math/ConvexHull.js',
	'./examples/js/modifiers/SimplifyModifier.js',
	'./examples/js/tone.js',
	'./examples/js/teoria.js'
//	'./examples/js/FileSaver.min.js',
//	'./examples/js/screenfull.min.js'
];

//JS
gulp.task('js-build', function () {
	return gulp.src(jsList)
		.pipe(concat('eyelib.js'))
		//.pipe(minify())
		.pipe(gulp.dest('./examples'));
});

gulp.task('default',
	gulp.series('js-build')//, 'js-vendor');
);
