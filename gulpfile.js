var gulp = require('gulp');
//var source = require('vinyl-source-stream');
//var rename = require('gulp-rename');
//var browserify = require('browserify');
//var es = require('event-stream');
//var tsify = require('tsify');
//var glob = require('glob');
var del = require('del');
//var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');
//var buffer = require('vinyl-buffer');
//var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var watch = require('gulp-watch');
var hash = require('gulp-hash');
var references = require('gulp-hash-references');
var log = require('fancy-log');
var runSequence = require('run-sequence');

const rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");


// TODO uninstall things not used

// Delete dist folder contents
gulp.task('clean-dist', function () {
     return del(['dist/**/*', '!dist/'], {force:true});
});

// Rev all static non-html files
gulp.task("revision", function(){
  return gulp.src(["src/css/*", "src/js/*", "src/images/*"], {base: 'src'})
    .pipe(rev())
    .pipe(gulp.dest("dist/"))
    .pipe(rev.manifest("manifest.json"))
    .pipe(gulp.dest("dist/"))
});

// Compile all html templates, and replace new rev names
gulp.task("compile-html", function(){
  var manifest = gulp.src("dist/manifest.json");

      gulp.src(["src/*.html", "!src/base.html"])
          .pipe(nunjucks.compile())
          .pipe(revReplace({manifest: manifest}))
          .pipe(gulp.dest("dist/"));

});

// Some js files reference revs too
gulp.task("compile-js", function(){
  var manifest = gulp.src("dist/manifest.json");

      gulp.src("dist/js/*")
          .pipe(revReplace({manifest: manifest}))
          .pipe(gulp.dest("dist/js"));
});

gulp.task('default', function() {

  return watch(["src/css/*", "src/images/*", "src/js/*", "src/*.html"], function () {
    runSequence("clean-dist", "revision", "compile-html", "compile-js");
  });
});



