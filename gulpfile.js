var gulp = require('gulp');
var concat = require('gulp-concat');
const { execSync } = require('child_process');

function fetchData(cb) {
  try {
    execSync('node getJson.js', { stdio: 'inherit' });
    cb();
  } catch (err) {
    cb(err);
  }
}

function concatenate() {
  return gulp.src(['./src/fetchedJsonData.js', './src/questionType.js', './src/question.js', './src/answer.js', './src/choice.js', './src/configuration.js', './src/ObjectFactory.js', './src/utils.js', './src/quizRunner.js', './src/application.js'])
    .pipe(concat('production.js')) // Removed the stat option
    .pipe(gulp.dest('./dist'));
}

exports.fetchData = fetchData;
exports.concatenate = concatenate;
exports.default = gulp.series(fetchData, concatenate);
