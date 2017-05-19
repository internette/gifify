var gulp = require('gulp');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
 
gulp.task('compress-js', function() {
  gulp.src('src/*.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
        ignoreFiles: ['main.js']
    }))
    .pipe(gulp.dest('src'))
});
gulp.task('compress-css', function(){
  gulp.src('src/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({
      basename: 'gifify',
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest('src'));
})

gulp.task('default', [ 'compress-css', 'compress-js' ]);