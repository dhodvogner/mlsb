// Required
var gulp = require('gulp');
var sass   = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var mainBowerFiles = require('main-bower-files');
var browserSync  = require('browser-sync').create();

var buildPath  = './build';

// Copy bower libs
gulp.task("bower-files", function(){
    gulp.src(mainBowerFiles("**/*.js"))
        .pipe(gulp.dest(buildPath + "/libs"));
    gulp.src(mainBowerFiles("**/*.css"))
        .pipe(gulp.dest(buildPath + "/libs"));
    gulp.src('./src/fonts/**/*.*') //Bootstrap fonts
        .pipe(gulp.dest(buildPath + '/fonts'));
});

// Copy Views and index
gulp.task('html', function(){
    gulp.src('./src/views/**/*.html')
        .pipe(gulp.dest(buildPath + '/views'));
    gulp.src('./src/index.html')
        .pipe(gulp.dest(buildPath + '/'));
});

// Script Task
gulp.task('scripts', function(){
    gulp.src('src/app/**/*.js')
        .pipe(plumber())
        //.pipe(rename({suffix:'.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest(buildPath + '/app'));
});

// SASS Task
gulp.task('sass', function(){
    gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sass()) //{outputStyle: 'compressed'}
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: { baseDir: buildPath }
    });
    gulp.watch('src/app/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch("src/*.html", ["html"]).on('change', browserSync.reload);
});

// Default Task
 gulp.task('default', ['bower-files', 'html', 'scripts', 'sass', 'serve']);