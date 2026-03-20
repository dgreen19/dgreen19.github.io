var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sass = require('sass');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var through = require('through2');

gulp.task('scripts', function() {
    return gulp.src('js/scripts.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('js'));
});

gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(through.obj(function(file, enc, cb) {
            try {
                const result = sass.compile(file.path, {
                    style: 'compressed'
                });
                file.contents = Buffer.from(result.css);
                cb(null, file);
            } catch (err) {
                console.log(err.message);
                cb();
            }
        }))
        .pipe(rename({extname: '.css'}))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
    gulp.watch('js/scripts.js', gulp.series('scripts'));
    gulp.watch('scss/styles.scss', gulp.series('styles'));
});