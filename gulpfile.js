var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');

gulp.task('default', function () {
  return gulp.src('./server/server.js')
    .pipe(loopbackAngular({apiUrl:'http://fankahui.com:3000/api'}))
    .pipe(rename('ef-services.js'))
    .pipe(gulp.dest('./Dashboard/src/js/dashboard'));
});