var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    watch = require('gulp-watch'),
    replace = require('gulp-replace');

gulp.task('scripts', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(concat ('canvasspinners.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('examples/dist'))
        .pipe(uglify())
        .pipe( rename ({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('examples/dist'))
});

gulp.task('watch', function(){
   gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('default',['scripts', 'watch']);

