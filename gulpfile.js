var gulp = require("gulp");
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var neat = require("node-neat").includePaths;
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var plumber = require('gulp-plumber');
var glob = require('glob');
var stream = require("event-stream");
var gutil = require("gulp-util");

function bundle(file){
  var srcval = file.replace("src/js/", "");
  return browserify({entries: [file], debug: true})
  .transform(babelify, {presets: ["es2015"]})
  .bundle()
  .on("error", function(err){
    gutil.beep();
    gutil.log(err.toString());
    this.emit("end");
  })
  .pipe(source(srcval))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest("./dist"));
};

gulp.task('bundle', function () {
  browserify({
    debug: true,
    entries: './src/react/app.js'
  })
  .require('normalize-css')
  .transform(babelify, {presets: ["es2015", "react"]})
  .bundle()
  .on('error', (error) => { console.error(error.name + ":", error.message, error.codeFrame); })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));
});

gulp.task('js', function (done) {
 glob("src/js/**/*.js", function(err, files){
   if(err){
     done(err);
   }
   var tasks = files.map(bundle);
   stream.merge(tasks).on("end", done);
 });
});

gulp.task('sass', function () {
  gulp.src('./src/scss/*.scss')
    .pipe(sass({ includePaths: [neat] }).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('watch', function() {
  gulp.watch(['./src/react/**/*.js'], ['bundle']);
  gulp.watch(['./src/js/**/*.js'], ['js']);
  gulp.watch(['./src/scss/*.scss'], ['sass']);
  gulp.watch(['./src/*','!./src/js/**/*', '!./src/react/**/*'], ['copy']);
});

gulp.task('copy', function () {
  gulp.src(['./src/*','!./src/js','!./src/scss','!./src/react/*'])
    .pipe(gulp.dest('dist'))
});


gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});


gulp.task('default', [
  'watch',
  'bundle',
  'sass',
  'copy',
  'js'
  ]
);
