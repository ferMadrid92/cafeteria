const { src, dest, watch, series, parallel } = require("gulp");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
  // compilar sass
  // 1 - identificar archivo 2 - compilar 3- guardar el .css

  src("src/scss/app.scss")
    .pipe( sourcemaps.init() )
    .pipe( sass() )
    .pipe( postcss([ autoprefixer(), cssnano() ]))
    .pipe( sourcemaps.write('.'))
    .pipe( dest('build/css') );

    done();
}

function imagenes( ) {
  return src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest('build/img'));
}

function imgWebp() {
  const opciones = { quality: 50 }
  return src('src/img/**/*.{png,jpg}')
      .pipe( webp(opciones))
      .pipe( dest('build/img'));
}

function imgAvif() {
  const opciones = { quality: 50, method: 'ssim' }
  return src('src/img/**/*.{png,jpg}')
      .pipe(avif(opciones))
      .pipe(dest('build/img'))
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.imgWebp = imgWebp;
exports.imgAvif = imgAvif;
exports.default = series(imagenes, imgWebp, imgAvif, css, dev);

// series - Se inicia una tarea y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo