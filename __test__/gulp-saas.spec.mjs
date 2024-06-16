import test from 'ava'
import gulp from 'gulp';
import buffer from 'gulp-buffer';
import fs from 'fs';
import path from 'path';
import compile from '../main.js';

function readExpectedOutput(expectedOutputFileName) {
    return fs.readFileSync(getExpectedPath(expectedOutputFileName), 'utf8');
}

function getExpectedPath(fileName) {
    return path.join('__test__', 'fixtures', 'expected', fileName);
}

test('gulp compile simple file', async (t) => {
    let cssContent = '';

    const compileSass = () => {
        return new Promise((resolve, reject) => {
            gulp.src('__test__/fixtures/scss/test.scss')
                .pipe(compile())
                .pipe(buffer())
                .on('data', function (file) {
                    cssContent = file.contents.toString();
                })
                .on('end', function () {
                    resolve(cssContent);
                })
                .on('error', reject);
        });
    };

    cssContent = await compileSass();

    t.is(cssContent.toString(), readExpectedOutput('test.css'));
});

test('gulp compile valid import', async (t) => {
    let cssContent = '';

    const compileSass = () => {
        return new Promise((resolve, reject) => {
            gulp.src('__test__/fixtures/scss/test-import.scss')
                .pipe(compile())
                .pipe(buffer())
                .on('data', function (file) {
                    cssContent = file.contents.toString();
                })
                .on('end', function () {
                    resolve(cssContent);
                })
                .on('error', reject);
        });
    };

    cssContent = await compileSass();

    t.is(cssContent.toString(), readExpectedOutput('test-import.css'));
});

// todo - research error flow
test('gulp compile invalid import', async (t) => {
    let cssContent = '';

    const compileSass = () => {
        return new Promise((resolve, reject) => {
            gulp.src('__test__/fixtures/scss/test-import-missing.scss')
                .pipe(compile())
                .pipe(buffer())
                .on('data', function (file) {
                    cssContent = file.contents.toString();
                })
                .on('end', function () {
                    resolve(cssContent);
                })
                .on('error', reject);
        });
    };

    cssContent = await compileSass();

    t.is(cssContent.toString(), 'body div {\n  color: red;\n}\n\nbody a {\n  color: red;\n}\n');
});