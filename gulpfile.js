'use strict';

var gulp = require('gulp');

var assign = Object.assign || require('object.assign')
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var cssmin = require('gulp-minify-css');
var del = require('del');
var jsmin = require('gulp-uglify');
var lint = require('gulp-eslint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var vinylPaths = require('vinyl-paths');

var babelOptions = {
  modules: 'system',
  moduleIds: false,
  comments: false,
  compact: false,
  stage: 2,
  optional: [
    "es7.decorators",
    "es7.classProperties"
  ]
};

var devDependencies = {
  js: [
    './bower_components/jquery/dist/jquery.js'
  ],
  css: [
    './bower_components/font-awesome/css/font-awesome.css'
  ],
  fonts: [
    './bower_components/font-awesome/fonts/*.*'
  ]
};

gulp.task('js-dependencies', function() {
  return gulp.src(devDependencies.js)
    .pipe(gulp.dest('./src/js/vendor'))
});

gulp.task('css-dependencies', function() {
  return gulp.src(devDependencies.css)
    .pipe(gulp.dest('./src/css/vendor'))
});

gulp.task('font-dependencies', function() {
  return gulp.src(devDependencies.fonts)
    .pipe(gulp.dest('./src/css/fonts'))
});

gulp.task('clean', function() {
  return gulp.src(['./dist/', './src/**/vendor/'])
    .pipe(vinylPaths(del));
});

gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failOnError());
});

gulp.task('build', function() {
  return gulp.src('./src/js/*.js')
    .pipe(concat('jigl.js'))
    //.pipe(babel(assign({}, babelOptions, { modules: 'common' })))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('sass', function() {
  return gulp.src("./src/sass/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('jigl.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', function() {
  return gulp.src('./dist/jigl.js')
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', function() {
  return gulp.src('./dist/jigl.css')
    .pipe(cssmin({ keepSpecialComments: 0 }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function(callback) {
  return runSequence(
    ['js-dependencies', 'css-dependencies', 'font-dependencies'],
    'lint',
    'build',
    'sass',
    callback
  );
});

gulp.task('production', function(callback) {
  return runSequence(
    'clean',
    'build',
    'sass',
    ['minify-js', 'minify-css'],
    callback
  );
});
