import gulp from 'gulp';
import mergeJSON from 'gulp-merge-json';
import gulpMap from 'gulp-map';
import revertObject from "./utils/reverseObject";
import isValidI18N from "./utils/isValidI18N";


/*
 * !!! TAKE INTO ACCOUNT !!!
 * TWO LEVEL JSONs ARE ONLY SUPPORTED,
 * DO NOT NEST PROPERTIES DEEPER THAN SECOND LEVEL
 */


var jsI18NResults = {};

/**
 * Combines all dictionaries that has `*.dictionary.js` extensions
 */
function combineI18NFromJS () {
    return gulp
        .src('./src/**/*.dictionary.js')
        .pipe(gulpMap(file => {

            var fl = require(file.path);

            let fileName = file.path.split('/');

            fileName = fileName[fileName.length - 1].split('.')[0];

            // for example, AjaxForm.dictionary.js --> ajaxFormDictionary
            fileName = `${fileName.charAt(0).toLowerCase()}${fileName.slice(1)}Dictionary`;

            if (isValidI18N(fl.dictionary)) {
                jsI18NResults = { ...jsI18NResults, ...fl.dictionary };
            } else if (isValidI18N(fl[fileName])) {
                jsI18NResults = { ...jsI18NResults, ...fl[fileName] };
            } else if (isValidI18N(fl.default)) {
                jsI18NResults = { ...jsI18NResults, ...fl.default };
            }

            return file;
        }));
};

function combineI18NFromJSON () {
    return gulp
        .src('./src/**/*.dictionary.json')
        .pipe(mergeJSON({
            fileName: 'i18n.json',
            startObj: jsI18NResults,
            transform: (json) => revertObject(json)
        }))
        .pipe(gulp.dest('./dist'));
};

export default gulp.series(combineI18NFromJS, combineI18NFromJSON);