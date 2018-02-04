var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    newer = require('gulp-newer'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    spritesmith = require('gulp.spritesmith'),
    notify = require("gulp-notify"),
    gulpif = require('gulp-if'),
    rename = require("gulp-rename"),
    gutil = require("gulp-util");

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        js: 'assets/js/',
        css: 'assets/css/',
        img: 'assets/images/',
        sprite: 'assets/images/src/'
    },
    src: { //Пути откуда брать исходники
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/scss/style.scss',
        img: 'src/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        icons: 'src/images/sprite/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        js: 'src/js/src/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*'
    }
};

var prod = true; //Если true то мы будем минифицировать и строить карты
var sm = false,
    allImg = false;


gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulpif(sm, sourcemaps.init())) //Инициализируем sourcemap
        .pipe(gulpif(prod, uglify())) //Сожмем наш js
        .pipe(gulpif(sm, sourcemaps.write())) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(gutil.env.type !== 'ci' ? notify("JS compiled: <%= file.relative %>!") : gutil.noop());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(gulpif(sm, sourcemaps.init())) //То же самое что и с js
        .pipe(sass().on('error', sass.logError)) //Скомпилируем
        .pipe(gulpif(prod, prefixer())) //Добавим вендорные префиксы
        .pipe(gulpif(prod, cssmin())) //Сожмем
        .pipe(gulpif(sm, sourcemaps.write()))
        .pipe(gulp.dest(path.build.css))
        .pipe(gutil.env.type !== 'ci' ? notify("STYLE compiled: <%= file.relative %>!") : gutil.noop());
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(gulpif(!allImg, newer(path.build.img)))
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
});


gulp.task('build', [
    'js:build',
    'style:build',
    'image:build'
]);

gulp.task('watch', function () {
    gulp.watch(path.watch.style, ['style:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
});

gulp.task('default', ['build', 'watch']);

