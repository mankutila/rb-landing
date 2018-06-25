const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const tinypng = require('gulp-tinypng');
const pug = require('gulp-pug');
const sourcemaps = require('gulp-sourcemaps');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const del = require('del');

gulp.task('sass:dev', () => {
  return gulp.src('dev/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer([
      '>0.25%',
      'not ie 11',
      'not op_mini all']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('sass:build', () => {
  return gulp.src('dev/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer([
      '>0.25%',
      'not ie 11',
      'not op_mini all']))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({message: 'Styles build task complete'}));
});
gulp.task('pug', () => {
  return gulp.src('dev/**/!(_)*.pug')
    .pipe(pug({
      'pretty': true
    }))
    .pipe(gulp.dest('dist/'));
});
gulp.task('js:dev', () => {
  return gulp.src('dev/js/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
gulp.task('js:build', () => {
  return gulp.src('dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
gulp.task('images:dev', () => {
  return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif)')
    .pipe(gulp.dest('dist/images'));
});
gulp.task('images:build', () => {
  return gulp.src('dev/images/**/*.+(png|jpg|jpeg|gif)')
    .pipe(tinypng('3zO9dS3QVQA8MOwy0RW7GLXpqt912PdK'))
    .pipe(gulp.dest('dist/images'));
});
gulp.task('fonts', () => {
  return gulp.src('dev/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));
});
/*Task for making svg sprite from all svgs*/
gulp.task('svg-sprite', () => {
  return gulp.src('dev/images/*.svg')
    .pipe(svgo())
    .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg'
          }
        }
      }
    ))
    .pipe(gulp.dest('dist/images'));
});
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});
gulp.task('clean', () => {
  return del(['dist/**/*.*']);
});

gulp.task('watch', ['pug', 'sass:dev', 'js:dev', 'images:dev', 'fonts', 'browserSync'], () => {
  gulp.watch('dev/scss/**/*.scss', ['sass:dev']);
  gulp.watch('dev/**/*.pug', ['pug']);
  gulp.watch('dev/js/*.js', ['js:dev']);
  gulp.watch('dev/images/**/*.*)', ['images:dev']);
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'pug', 'sass:build', 'js:build', 'images:build', 'fonts', 'browserSync'], () => {
  gulp.watch('dev/scss/**/*.scss', ['sass:build']);
  gulp.watch('dev/**/*.pug', ['pug']);
  gulp.watch('dev/js/*.js', ['js:build']);
  gulp.watch('dev/images/**/*.*)', ['images:build']);
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/js/**/*.js', browserSync.reload);
});
