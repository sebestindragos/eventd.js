'use strict';

const gulp = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('compile', () => {
  let ts = typescript.createProject('tsconfig.json', {
    declaration: true
  });
  return gulp.src([
    'src/**/*.ts'
  ])
  .pipe(sourcemaps.init())
  .pipe(ts())
  .pipe(sourcemaps.write('.', {
    sourceRoot: (file) => {
      return file.cwd + '/src'
    }
  }))
  .pipe(gulp.dest('build/'));
});

gulp.task('default', ['compile']);
