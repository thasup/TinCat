const { watch, dest, src } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

function styles() {
    return src("sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./css"))
        .pipe(browserSync.stream());
}

exports.styles = styles;
exports.default = function () {
    watch("sass/**/*.scss", styles);
    browserSync.init({
        server: "./",
    });
};
