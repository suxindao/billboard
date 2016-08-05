var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  sass: ['./scss/**/*.scss']
};

var sdir = "./bower_components/";
var jsdir = "./www/lib/";
var cssdir = "./www/css/";

var filesToMove = [
  sdir + '/ionic/js/ionic.bundle.js',
  sdir + '/ngCordova/dist/ng-cordova.js',
  sdir + '/Swiper/dist/js/swiper.js'
];

gulp.task('default', ['clean', 'cpjs', 'sass']);

gulp.task('clean', ['cleanJS', 'cleanCSS']);

gulp.task('cleanJS', function () {
  return gulp.src([jsdir], {read: false})
    .pipe(clean());
});

gulp.task('cleanCSS', function () {
  return gulp.src([cssdir], {read: false})
    .pipe(clean());
});

gulp.task('cpjs', ['cleanJS'], function () {
  return gulp.src(filesToMove)
    .pipe(gulp.dest(jsdir));
});

gulp.task('sass', ['cleanCSS'], function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    // .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
