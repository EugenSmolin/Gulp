'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass'); // компилирует в css
const concat = require('gulp-concat'); // объеденяет все в один файл
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug'); // 
const del = require('del'); // очищает папку
const gulpIf = require('gulp-if'); // 
const newer = require('gulp-newer'); //
const autoprefixer = require('gulp-autoprefixer'); // добавляет в css префиксы
const remember = require('gulp-remember'); // 
const gulpPath = require('path');
const cached = require('gulp-cached');
const browserSync = require('browser-sync').create(); // запускает локальный браузер Синк
const notify = require('gulp-notify'); // отлов ошибок
const plumber = require('gulp-plumber');
const multipipe = require('multipipe'); // отлов ошибок
const rigger = require('gulp-rigger'); // сборка html файлов
// const File = require('vinyl'); // 

// const through2 = require('through2').obj; // Создание плагинов

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
// set NODE_ENV=development&&gulp build // продакшен или девелопмент для Windows


gulp.task('sass', function() {
	return multipipe(
		gulp.src('frontend/sass/main.sass'),
		plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'sass',
					message: err.message
				};
			})
		}),
		autoprefixer({
			browsers: ['last 16 versions'],
            cascade: false
		}),
		gulpIf(isDevelopment, sourcemaps.init()),
		sass(),
		gulpIf(isDevelopment, sourcemaps.write('.')),
		gulp.dest('public/css')
	).on('error', notify.onError());
});

gulp.task('html', function() {
	return gulp.src('frontend/**/*.html')
		.pipe(rigger())
		.pipe(gulp.dest('public'));
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

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'assets'), 'html'));

gulp.task('watch', function() {
	gulp.watch('frontend/sass/**/*.*', gulp.series('sass'));//, gulp.series('sass')).on('unlink', function(filepath) {
		// remember.forget('sass', gulpPath.resolve(filepath));
		// delete cached.caches.sass[path.resolve(filepath)];
	// });
	gulp.watch('frontend/**/*.*', gulp.series('assets'));
	gulp.watch('frontend/**/*.html', gulp.series('html'));
});
// chokidar

gulp.task('serve', function() {
	browserSync.init({
		server: 'public'
	});

	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));




// gulp.task('assets', function() {
// 	const mtimes = {};
// 	return gulp.src('frontend/**/*.*')
// 		.pipe(through2(
// 			function(file, enc, callback) {
// 				// let file2 = file.clone(); // vinyl
// 				// file2.path += '.bak';
// 				// this.push(file2);
// 				mtimes[file.relative] = file.stat.mtime;
// 				callback(null, file);
// 			},
// 			function(callback) {
// 				let manifest = new File({
// 					contents: new Buffer(JSON.stringify(mtimes)),
// 					base: process.cwd(),
// 					path: process.cwd() + '/manifest.json'
// 				});
// 				this.push(manifest);
// 				callback();
// 			}
// 		))
// 		.pipe(gulp.dest('public'));
// });

// gulp.task('dev', gulp.series('clean', 'assets'));





