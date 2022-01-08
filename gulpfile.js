const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));

gulp.task("default", function () {
    console.log("Hello World");
});

gulp.task("styles", function () {
    gulp.src("sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./css"));
});
