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

gulp.task('clean', function() {
  return gulp.src('./dist/')
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

//gulp.task('sass', function() {
//  return gulp.src("./src/css/*.scss")
//    .pipe(sass().on('error', sass.logError))
//    .pipe(gulp.dest('./dist/'));
//});

// Remove me once SASS is in place
gulp.task('sass', function() {
  return gulp.src("./src/css/*.css")
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
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function(callback) {
  return runSequence(
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
