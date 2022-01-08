const { watch, dest, src, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const jasmineBrowser = require("gulp-jasmine-browser");

function styles() {
    return src("sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./css"))
        .pipe(browserSync.stream());
}

function lint() {
    return src(["js/**/*.js"])
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
exports.test = test;
exports.default = function () {
    series(styles, lint, test);
    watch("sass/**/*.scss", styles);
    browserSync.init({
        server: "./",
    });
};
