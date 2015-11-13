'use strict';

var gulp = require("gulp"),
		browserSync  = require("browser-sync"),
		reload = browserSync.reload,
		jade = require('gulp-jade'),
		prefix = require('gulp-autoprefixer'),
		sass = require("gulp-sass"),
		sourcemaps = require('gulp-sourcemaps'),
		useref = require('gulp-useref'),
		uglify = require('gulp-uglify'),
		gulpif = require('gulp-if'),
		minifyCss = require('gulp-minify-css'),
		uncss = require('gulp-uncss'),
		imagemin = require('gulp-imagemin'),
		cache = require('gulp-cache'),
		del = require('del'),
		runSequence = require('run-sequence'),
		modernizr = require('gulp-modernizr'),
		wiredep = require('wiredep').stream;

/**
 * Start BrowserSync static server (proxy: "yourlocal.dev" for dynamic sites)
 */
	gulp.task('browserSync', function() {
	  browserSync({
			notify: false,
			port: 3030,
	    server: {
	      baseDir: './app'
	    },
	  })
	});

/**
 * Compile jade files into HTML + Wiredep (add bower_components auto)
 */
gulp.task('jade', function() {
	return gulp.src('./app/jade/index.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(wiredep({
			directory: './app/bower_components',
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('./app'))
});
gulp.task('jade-watch', ['jade'], reload);

/**
 * Wire Bower dependencies to your source code
 */
gulp.task('bower', function () {
	gulp.src('./app/*.html')
		.pipe(wiredep({
			directory: "./app/bower_components"
		}))
		.pipe(gulp.dest('./app'));
});

/**
 * Compile your Sass files + Autoprefixer + Sourcemaps
 */
gulp.task('sass', function () {
	return gulp.src('./app/scss/**/*.scss')
		.pipe(sourcemaps.init())
			.pipe(sass({
				includePaths: ['css'],
			}).on('error', sass.logError))
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./app/css'))
		.pipe(reload({stream: true}));
});

/**
 * Combine + minify CSS and JS
 */
gulp.task('useref', function(){
	var assets = useref.assets();
	return gulp.src('./app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('./dist'))
});

/**
 * Remove unused CSS selectors(optional/in test)
 */
gulp.task('uncss', function () {
	return gulp.src('./dist/css/*.css')
		.pipe(uncss({
			html: ['./dist/index.html']
		}))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist/css'));
});

/**
 * Detects HTML5 and CSS3 features in the user’s browser(optional/in test)
 */
gulp.task('modernizr', function() {
	gulp.src('./dist/js/*.js')
		.pipe(modernizr())
		.pipe(uglify())
		.pipe(gulp.dest("./dist/js"))
});

/**
 * Minify PNG, JPEG, GIF and SVG images
 */
gulp.task('images', function(){
	return gulp.src('./app/img/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('./dist/img'))
});

/**
 * Copying Fonts to /dist
 */
gulp.task('fonts', function() {
	return gulp.src('./app/fonts/**/*')
	.pipe(gulp.dest('./dist/fonts'))
});

/**
 * Cleaning up generated files automatically
 */
gulp.task('clean:dist', function(callback){
	del(['./dist/**/*', '!dist/img', '!dist/img/**/*'], callback)
});
gulp.task('clean', function(callback) {
	del('dist');
	return cache.clearAll(callback);
});

/**
 * Bild project to ./dist (you can add 'uncss' befor 'modernizr', optional)
 */
gulp.task('build', function (callback) {
	runSequence('clean:dist',
		['jade', 'sass', 'images', 'fonts'], 'useref', ['modernizr'],
		callback
	)
});

/**
 * Start project at server
 */
gulp.task('default', function (callback) {
	runSequence(['jade', 'sass', 'browserSync'],
		callback
	)
	gulp.watch('./app/scss/**/*.**', ['sass']);
	gulp.watch('./app/jade/**/*.jade', ['jade-watch']);
	gulp.watch('./app/js/**/*.**', reload);
	gulp.watch('bower.json', ['bower'], reload);
});