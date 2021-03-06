var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var nunjucks = require('gulp-nunjucks');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var sitemap = require('gulp-sitemap');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var cleanCSS = require('gulp-clean-css');
var imageMin = require('gulp-imagemin');
var merge = require('merge-stream');

// Delete dist folder contents
gulp.task('clean-dist', function () {
    return del(['dist/**/*', '!dist/'], {force: true});
});

// Rev all static non-html files, and minify them
gulp.task("revision", function () {

    return merge(
        gulp.src("src/css/*", {base: 'src'})
            .pipe(cleanCSS()),

        gulp.src("src/js/*", {base: 'src'})
            .pipe(uglify({mangle: {toplevel: true}})),

        gulp.src("src/images/*", {base: 'src'})
            .pipe(imageMin())
    )
        .pipe(rev())
        .pipe(gulp.dest("dist/"))
        .pipe(rev.manifest("manifest.json"))
        .pipe(gulp.dest("./"))
});

// Compile all html templates, and replace new rev names
gulp.task("compile-html", function () {
    var manifest = gulp.src("./manifest.json");

    gulp.src(["src/*.html", "!src/base.html"])
        .pipe(nunjucks.compile())
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("dist/"));

});

// Some js files reference revs too
gulp.task("compile-js", function () {
    var manifest = gulp.src("./manifest.json");

    gulp.src("dist/js/*")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("dist/js"));
});

// Robots for you and me
gulp.task("robots", function () {
    return gulp.src("src/robots.txt")
        .pipe(gulp.dest("dist/"));
});

// Build sitemap
gulp.task('sitemap', function () {
    gulp.src(['src/*.html', "!src/base.html"])
        .pipe(sitemap({
            siteUrl: 'https://tommysantoyo.com',
            getLoc: function(siteUrl, loc, entry) { return loc.replace(/\.\w+$/, '')}
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', function () {
    return watch(["src/**/*"], function () {
        runSequence("clean-dist", "revision", "compile-html", "compile-js", "robots", "sitemap");
    });
});
