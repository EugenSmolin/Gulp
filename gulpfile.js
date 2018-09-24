'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass'); // компилирует в css
const concat = require('gulp-concat'); // объеденяет все в один файл
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug'); // 
const del = require('del'); // очищает папку
const gulpIf = require('gulp-if'); // 
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer'); // добавляет в css префиксы
const remember = require('gulp-remember'); // 
const gulpPath = require('path');
const cached = require('gulp-cached');
const browserSync = require('browser-sync').create(); // запускает локальный браузер Синк
const notify = require('gulp-notify'); // отлов ошибок
const plumber = require('gulp-plumber');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('sass', function() {
	return gulp.src('frontend/sass/main.scss')
		// .pipe(cached('sass'))
		// .pipe(remember('sass'))
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'sass',
					message: err.message
				};
			})
		}))
		.pipe(autoprefixer({
			browsers: ['last 16 versions'],
            cascade: false
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
		.pipe(gulp.dest('public/css'));
});

gulp.task('clean', function() {
	return del('public');
});

gulp.task('assets', function() {
	return gulp.src('frontend/**', {since: gulp.lastRun('assets')}) // обновляет последние измененные файлы
		// .pipe(newer('public')) // не повторяет файлы, компилит новые
		.pipe(debug({title: 'assets'}))
		.pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'assets')));

gulp.task('watch', function() {
	gulp.watch('frontend/sass/**/*.*', gulp.series('sass'));//, gulp.series('sass')).on('unlink', function(filepath) {
		// remember.forget('sass', gulpPath.resolve(filepath));
		// delete cached.caches.sass[path.resolve(filepath)];
	// });
	gulp.watch('frontend/**/*.*', gulp.series('assets'));
});
// chokidar

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));




// set NODE_ENV=development&&gulp build // продакшен или девелопмент

// gulp.task('sass', function() {
// 	return gulp.src('frontend/**/*.scss')
// 		.pipe(debug())
// 		.pipe(sass())
// 		.pipe(debug())
// 		.pipe(gulp.dest('public'));
// });

