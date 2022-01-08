const { watch, dest, src, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const jasmineBrowser = require("gulp-jasmine-browser");
const concat = require("gulp-concat");
const uglify = require("gulp-uglifyjs");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const prefix = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

function styles() {
    return src("sass/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(prefix("last 2 versions"))
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(sourcemaps.write())
        .pipe(dest("./docs/css"))
        .pipe(browserSync.stream());
}

function html() {
    return src("./index.html").pipe(dest("./docs"));
}

function images() {
    return src("./images/*")
        .pipe(
            imagemin({
                progressive: true,
                use: [pngquant()],
            })
        )
        .pipe(dest("./docs/images"));
}

function scripts() {
    return src("./js/**/*.js")
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(dest("./docs/js"));
}

function scriptsDocs() {
    return src("./js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest("./docs/js"));
}

function lint() {
    return src(["./js/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
}

// function test() {
//     return src("tests/spec/extraSpec.js")
//         .pipe(jasmineBrowser.specRunner({ console: true }))
//         .pipe(jasmineBrowser.headless({ driver: "chrome" }));
// }

function test() {
    return src("tests/spec/extraSpec.js")
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({ port: 3001 }));
}

exports.styles = styles;
exports.lint = lint;
exports.test = test;
exports.build = parallel(images, series(html, styles, scriptsDocs));
exports.default = function () {
    parallel(images, series(html, styles));

    watch("./sass/**/*.scss", styles);
    watch("./js/**/*.js", lint);
    watch("./index.html", html);
    browserSync.init({
        server: "./docs",
    });
};
