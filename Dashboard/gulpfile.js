var gulp          = require('gulp'),
  rename          = require('gulp-rename'),
  loopbackAngular = require('gulp-loopback-sdk-angular'),
  less            = require('gulp-less'),
  usemin          = require('gulp-usemin'),
  wrap            = require('gulp-wrap'),
  connect         = require('gulp-connect'),
  watch           = require('gulp-watch');

var paths = {
  js: 'src/js/**/*.*',
  fonts: 'src/fonts/**.*',
  images: 'src/img/**/*.*',
  styles: 'src/less/**/*.less',
  partials: 'src/partials/**/*',
  index: 'src/index.html',
  bower_fonts: 'src/bower_components/**/*.{ttf,woff,eof,svg}',
  bower_components: 'src/bower_components/**/*.*',
};


gulp.task('usemin', function() {
  return gulp.src(paths.index)
    .pipe(usemin({
      less: ['concat', less()],
      js: ['concat', wrap('(function(){ \n<%= contents %>\n})();')],
    }))
    .pipe(gulp.dest('../client/'));
});

/**
 * Copy assets
 */
gulp.task('copy-assets', ['copy-partials', 'copy-images', 'copy-fonts', 'copy-bower_fonts']);

gulp.task('copy-partials', function(){
  return gulp.src(paths.partials)
    .pipe(gulp.dest('../client/partials'));
});

gulp.task('copy-images', function(){
  return gulp.src(paths.images)
    .pipe(gulp.dest('../client/img'));
});

gulp.task('copy-fonts', function(){
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('../client/fonts'));
});

gulp.task('copy-bower_fonts', function(){
  return gulp.src(paths.bower_fonts)
    .pipe(gulp.dest('../client/lib'));
});

/**
 * Watch src
 */
gulp.task('watch', function () {
  gulp.watch([paths.styles, paths.index, paths.js], ['usemin']);
  gulp.watch([paths.partials], ['copy-partials']);
  gulp.watch([paths.images], ['copy-images']);
  gulp.watch([paths.fonts], ['copy-fonts']);
  gulp.watch([paths.bower_fonts], ['copy-bower_fonts']);
});

gulp.task('webserver', function() {
  connect.server({
    root: '../client',
    livereload: true
  });
});

gulp.task('livereload', function() {
  gulp.src(['../client/**/*.*'])
    .pipe(watch())
    .pipe(connect.reload());
});

/**
 * Compile less
 */
gulp.task('compile-less', function(){
  return gulp.src(paths.styles)
      .pipe(less())
      .pipe(gulp.dest('../client/css'));
});

gulp.task('build', ['usemin', 'copy-assets']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);
