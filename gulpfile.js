const { watch, dest, src, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const jasmineBrowser = require("gulp-jasmine-browser");
const concat = require("gulp-concat");

function styles() {
    return src("sass/**/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(dest("./docs/css"))
        .pipe(browserSync.stream());
}

function html() {
    return src("./index.html").pipe(dest("./docs"));
}

function images() {
    return src("./images/*").pipe(dest("./docs/images"));
}

function scripts() {
    return src("./js/**/*.js").pipe(concat("all.js")).pipe(dest("./docs/js"));
}

function scriptsDist() {
    return src("./js/**/*.js").pipe(concat("all.js")).pipe(dest("./docs/js"));
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
exports.build = parallel(images, series(html, styles, scripts));
exports.default = function () {
    parallel(images, series(html, styles));

    watch("./sass/**/*.scss", styles);
    watch("./js/**/*.js", lint);
    watch("./index.html", html);
    browserSync.init({
        server: "./docs",
    });
};
