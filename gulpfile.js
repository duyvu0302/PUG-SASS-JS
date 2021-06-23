const { src, dest, parallel, watch, series } = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  browserSync = require('browser-sync').create();

const FilesPath = {
  sassFiles: 'src/sass/**/*.scss',
  htmlFiles: 'src/pug/pages/*.pug',
  jsFiles: "src/js/*.js",
  
};

function sassTask() {
  return src(FilesPath.sassFiles)
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src(FilesPath.htmlFiles)
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src(FilesPath.jsFiles).pipe(dest("dist/assets/js"));
}
function assetsTask() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
  browserSync.init({ server: { baseDir: './dist' } });
  watch(FilesPath.sassFiles, sassTask);
  watch('src/pug/**/*.pug', htmlTask);
  watch("src/js/*.js", jsTask);

}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, assetsTask,jsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, assetsTask,jsTask));