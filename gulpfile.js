var gulp = require('gulp');
var minifyJS = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
 
gulp.task('compress-js', function() {
  gulp.src('src/*.js')
    .pipe(minifyJS({
        ext:{
            src:'.js',
            min:'.min.js'
        },
        ignoreFiles: ['main.js', '*.min.js']
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