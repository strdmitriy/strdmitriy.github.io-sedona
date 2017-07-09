'use strict';

var gulp = require('gulp');
var precss = require('precss');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var ghPages = require('gulp-gh-pages');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var server = require('browser-sync').create();
var run = require('run-sequence');
var del = require('del');

gulp.task('style', function() {
  gulp.src('src/postcss/style.css')
    .pipe(plumber())
    .pipe(postcss([
     precss(),
      autoprefixer({browsers: [
        'last 1 version',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Edge versions'
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style-min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp.src('build/img/**/*.{jpg, png, gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest('build/img'));
});

gulp.task('minjs', function() {
  gulp.src('src/js/*.js')
    .pipe(gulp.dest('build/js/'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js/minjs'));
});

gulp.task('symbols', function() {
  return gulp.src('build/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('symbols.svg'))
  .pipe(gulp.dest('build/img'));
})

gulp.task('copy', function() {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src/js/**',
    'src/*.html'
  ], {
    base: 'src/'
  })
  .pipe(gulp.dest('build'));
});
gulp.task('html', function() {
  gulp.src('src/*html')
    .pipe(gulp.dest('build'));
});
gulp.task('clean', function() {
  return del('build')
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'style',
    'images',
    'symbols',
    'minjs',
    fn
  );
});
gulp.task("deploy", function() {
  return gulp.src("./build/**/*")
    .pipe(ghPages());
});

gulp.task('serve', function() {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('src/postcss/**/*.css', ['style']);
  gulp.watch("src/js/**/*.js", ["minjs"]);
  gulp.watch('src/*.html').on('change', server.reload);
});
