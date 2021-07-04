const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

gulp.task('build', () => {
  const tsProject = ts.createProject('tsconfig.json');

  if (fs.existsSync(tsProject.options.outDir)) {
    fs.rmdirSync(tsProject.options.outDir, { recursive: true });
  }

  const tsResult = tsProject
    .src()
    .pipe(babel())
    .pipe(gulp.dest(tsProject.options.outDir));

  return tsResult;
});
