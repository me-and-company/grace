/*
    IMPORTS
*/
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import fileinclude from 'gulp-file-include';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';

import mozjpeg from 'imagemin-mozjpeg';
import jpegtran from 'imagemin-jpegtran';
import pngquant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';

import browserSync from 'browser-sync';
import del from 'del';

import iconsToStrings from './scripts/generate-icons-list.js';


/*
    CONFIG
*/
const paths = {
  styles: {
    src: 'src/sass',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js',
    dest: 'dist/js/'
  },
  html: {
    src: 'src/html',
    dest: 'dist/'
  },
  images: {
    src: 'src/img',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts',
    dest: 'dist/fonts/'
  }
};

const config = {
  // see browserlist: http://browserl.ist/
  browsers: ['Safari >= 10.1', 'Firefox >= 60', 'Chrome >= 61', 'iOS >= 10.3', 'not IE <= 11', 'Edge >= 16'],
  browsers_legacy: ['last 4 versions', '> 1%', 'not ie <= 10', 'not Edge <= 13', 'Safari >= 8', 'Firefox ESR'],
  svgo: {
    plugins: [
      {
        removeViewBox: false,
      },
      {
        removeDimensions: true,
      },
      {
        removeStyleElement: true,
      },
      {
        addClassesToSVGElement: {
          classNames: ['icon-svg']
        }
      },
    ]
  }
}
config.babel = {
  "babelrc": false,
  "presets": [
    [
      "env",
      {
        modules: false,
        useBuiltIns: true,
        "targets": {
          "browsers": config.browsers
        }
      }
    ],
    [
      "minify"
    ]
  ]
}
config.babel_legacy = {
  "babelrc": false,
  "presets": [
    [
      "env",
      {
        modules: false,
        useBuiltIns: false,
        "targets": {
          "browsers": config.browsers_legacy
        }
      }
    ],
    [
      "minify"
    ]
  ]
}


/*
    CONS & HELPERS
*/
const _gulpsrc = gulp.src;
gulp.src = function() {
  return _gulpsrc.apply(gulp, arguments)
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title:    "Gulp Error",
          message:  "Error: <%= error.message %>",
          sound:    "Bottle"
        })(err);
        this.emit('end');
      }
    }));
};

// Browser Sync
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './dist/'
    }
  });
  done();
}


/*
    BUILD
*/

// Styles
export function styles() {
  return gulp.src(`${paths.styles.src}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: config.browsers_legacy,
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest));
}

// Javascript
export function deleteScripts(done) {
  del([`${paths.scripts.dest}**/*`, `!${paths.scripts.dest}**/unicorn.js`]).then((paths) => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
    done();
  });
}

export function scripts_libs() {
  return gulp.src([
      `${paths.scripts.src}/libs/first/*.js`,
      `${paths.scripts.src}/libs/*.js`
    ], { sourcemaps: true })
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function scripts_singles() {
  return gulp.src([`${paths.scripts.src}/singles/**/*.js`])
    .pipe(gulp.dest(paths.scripts.dest));
}

export function scripts_main_legacy() {
  return gulp.src([
      `${paths.scripts.src}/functions/*.js`,
      `${paths.scripts.src}/modules/*.js`,
      `${paths.scripts.src}/base/*.js`
    ], { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      babel(Object.assign(
        config.babel_legacy,
        {
          "plugins": [
            ["transform-remove-console", { "exclude": ["error", "warn"] }]
          ]
        }
      ))
    )
    .pipe(concat('main.legacy.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}
export function scripts_main() {
  return gulp.src([
      `${paths.scripts.src}/functions/*.js`,
      `${paths.scripts.src}/modules/*.js`,
      `${paths.scripts.src}/base/*.js`
    ], { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      babel(Object.assign(
        config.babel,
        {
          "plugins": [
            ["transform-remove-console", { "exclude": ["error", "warn"] }]
          ]
        }
      ))
    )
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function scripts_main_dev_legacy() {
  return gulp.src([
      `${paths.scripts.src}/functions/*.js`,
      `${paths.scripts.src}/modules/*.js`,
      `${paths.scripts.src}/base/*.js`
    ], { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      babel(Object.assign(
        config.babel_legacy,
        {
          "presets": [
            config.babel_legacy.presets[0]
          ]
        }
      ))
    )
    .pipe(concat('main.legacy.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}
export function scripts_main_dev() {
  return gulp.src([
      `${paths.scripts.src}/functions/*.js`,
      `${paths.scripts.src}/modules/*.js`,
      `${paths.scripts.src}/base/*.js`
    ], { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      babel(Object.assign(
        config.babel,
        {
          "presets": [
            config.babel.presets[0]
          ]
        }
      ))
    )
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}

const scripts = gulp.series(
  deleteScripts,
  scripts_libs,
  scripts_singles,
  scripts_main_legacy,
  scripts_main
);
export { scripts };

const scripts_dev = gulp.series(
  deleteScripts,
  scripts_libs,
  scripts_singles,
  scripts_main_dev_legacy,
  scripts_main_dev
);
export { scripts_dev };


// HTML
export function html() {
  return gulp.src(`${paths.html.src}/**/*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.html.dest));
}

// Includes
export function include() {
  return gulp.src([
    `${paths.html.src}/**/*.html`,

    `!${paths.html.src}/snippets/*.html`
  ])
  .pipe(fileinclude({
    prefix: '@@',
    basepath: './'
  }))
  .pipe(gulp.dest(paths.html.dest))
}


// Images
export function delete_images(done) {
  del([`${paths.images.dest}**/*`, `!${paths.images.dest}**/unicorn.jpg`]).then((paths) => {
    console.log('Deleted image files and folders:\n', paths.join('\n'));
    done();
  });
}

export function imagemin_compress() {
  return gulp.src([
      `${paths.images.src}/**/*`,
      `${paths.images.src}/icons/**/*`,

      // not files / directories below
      `!${paths.images.src}/**/*.md`,
      `!${paths.images.src}/_lossless/**/*`,
      `!${paths.images.src}/_highq/**/*`,
    ])
    .pipe(imagemin([
      mozjpeg({progressive: true, quality: 85}),
      pngquant({speed: 6, quality: 80}),
      svgo(config.svgo)
    ]))
    .pipe(gulp.dest(paths.images.dest))
}

export function imagemin_highq() {
  return gulp.src([
    `${paths.images.src}/_highq/**/*`,

    // not files / directories below
    `!${paths.images.src}/_highq/**/*.md`,
  ])
  .pipe(imagemin([
    mozjpeg({progressive: true, quality: 95}),
    pngquant({speed: 6, quality: 95}),
  ]))
  .pipe(gulp.dest(`${paths.images.dest}_highq`))
}

export function imagemin_lossless() {
  return gulp.src([
    `${paths.images.src}/_lossless/**/*`,

    // not files / directories below
    `!${paths.images.src}/_lossless/**/*.md`,
  ])
  .pipe(imagemin([
    jpegtran({progessive: true}),
    pngquant({speed: 6, quality: 100}),
  ]))
  .pipe(gulp.dest(`${paths.images.dest}_lossless`))
}

// Icons to Strings
export function icons(done) {
  iconsToStrings().then(() => {
    console.log('is done');
    done();
  });
}

const images = gulp.series(
  delete_images,
  imagemin_compress,
  imagemin_highq,
  imagemin_lossless,
  icons,
);
export { images };


// FONTS
export function delete_fonts(done) {
  del(`${paths.fonts.dest}**/*`).then((paths) => {
    console.log('Deleted font files and folders:\n', paths.join('\n'));
    done();
  });
}
export function copy_fonts() {
  return gulp.src(`${paths.fonts.src}/**/*`)
  .pipe(gulp.dest(paths.fonts.dest));
}

const fonts = gulp.series(
  delete_fonts,
  copy_fonts
);
export { fonts }


/*
  TASKS
*/
const watch = () => {
  gulp.watch(`${paths.html.src}/**/*.html`, gulp.series(include, reload));
  gulp.watch(`${paths.styles.src}/**/*.scss`, gulp.series(styles, reload));
  gulp.watch([
      `${paths.scripts.src}/functions/*.js`,
      `${paths.scripts.src}/modules/*.js`,
      `${paths.scripts.src}/base/*.js`
    ],
    gulp.series(gulp.parallel(scripts_main_dev_legacy, scripts_main_dev, scripts_libs), reload)
  );
  gulp.watch(`${paths.fonts.src}/**/*`, gulp.series(fonts, reload));
};
export { watch };


const dev = gulp.series(
  gulp.parallel(html, styles, scripts_dev, fonts),
  serve,
  watch
);
export { dev };


const build = gulp.series(
  include,
  gulp.parallel(html, styles, scripts, fonts),
  images,
  icons
);
export { build };
