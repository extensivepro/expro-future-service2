var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');

gulp.task('generate-angularjs-sdk',function () {
  return gulp.src('./server/server.js')
    .pipe(loopbackAngular({apiUrl:'http://fankahui.com:3000/api'}))
    .pipe(rename('ef-services2.js'))
    .pipe(gulp.dest('../bower-ef-services2'));
})

gulp.task('default', ['generate-angularjs-sdk']);