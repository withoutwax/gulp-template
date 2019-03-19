const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();

function htmlTask() {
    let sources = src(['./dist/css/**/*.css'], { read:false });

    return src('./src/**/*.html')
    .pipe(inject(sources,  {ignorePath: 'dist/', addRootSlash: false})) // Injecting CSS link in index.html - Currently it is set to have the links injected to all* *.html files - need fix
    .pipe(dest('./dist'))
}

function sassTask() {
    return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    // Use postcss with autoprefixer and compress the compiled file using cssnano
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist/css/'))
    // .pipe(browserSync.stream());
}


function browserSyncTask() {
    browserSync.init({
        server: './dist'
    });

    watch('./src/**/*.html', series(htmlTask));
    watch('./src/scss/**/*.scss', series(sassTask));
    watch('./src/**/*.html').on('change', browserSync.reload);
    watch('./src/scss/**/*.scss').on('change', browserSync.reload);
}


function defaultTask() {
    console.log('Gulp file has been initiated');
    // watch('./src/**/*.html', series(htmlTask));
    // watch('./src/sass/**/*.scss', series(sassTask));
    return series(htmlTask, sassTask);
}

exports.default = browserSyncTask; // series(sassTask, htmlTask)