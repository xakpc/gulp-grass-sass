import test from 'ava'
import path from 'path';
import { compileSass, compileSassFromFile, compileSassFromOptions, SassSyntax } from '../index.js'
import fs from 'fs';

function getFilePath(fileName) {
    return path.join('__test__', 'fixtures', 'scss', fileName);
}

function readExpectedOutput(expectedOutputFileName) {
    let output = fs.readFileSync(getExpectedPath(expectedOutputFileName), 'utf8');
    return output.replace(/\r\n/g, '\n');;
}

function getExpectedPath(fileName) {
    return path.join('__test__', 'fixtures', 'expected', fileName);
}

test('compileSass from native', (t) => {
    t.is(compileSass('a { b { color: &; } }'), 'a b {\n  color: a b;\n}\n');
})

test('compileSass is empty when input is empty', (t) => {
    t.is(compileSass(''), '');
})

test('compileSass throws generic error when input is invalid', (t) => {
    t.throws(() => {
        compileSass('a');
    }, { instanceOf: Error, code: 'GenericFailure' });
})

test('compileSass throws generic error when input is null', (t) => {
    t.throws(() => {
        compileSass('a');
    }, { instanceOf: Error, code: 'GenericFailure' });
})

test('compileSassFromFile from native', (t) => {
    t.is(compileSassFromFile(getFilePath('test.scss')), readExpectedOutput('test.css'));
})

test('compileSassFromFile with imports', (t) => {
    t.is(compileSassFromFile(getFilePath('test-import.scss')), readExpectedOutput('test-import.css'));
})

test('compileSass throws error when file not found', (t) => {
    const error = t.throws(() => {
        compileSassFromFile(getFilePath('not-existing.scss'));
    }, { instanceOf: Error, code: 'GenericFailure' });

    t.true(error.message.includes('The system cannot find the file specified'), 'Error message should contain "The system cannot find the file specified"');
})

test('compileSass throws error when import not found', (t) => {
    const error = t.throws(() => {
        compileSassFromFile(getFilePath('test-import-missing.scss'));
    }, { instanceOf: Error, code: 'GenericFailure' });

    t.true(error.message.includes('Can\'t find stylesheet to import'), 'Error message should contain "Can\'t find stylesheet to import"');
})

test('compileSassFromOptions from native', (t) => {
    t.is(compileSassFromOptions({ data: 'a { b { color: &; } }' }), 'a b {\n  color: a b;\n}\n');
})

// Test compiling SASS from data
test('compileSassFromOptions with data', (t) => {
    const options = {
        data: 'a { b { color: &; } }',
        file: undefined,
        intendedSyntax: false,
        includePaths: []
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: a b;\n}\n');
});

// Test compiling SASS from data
test('compileSassFromOptions with data with undefined rest of the fields', (t) => {
    const options = {
        data: 'a { b { color: &; } }'
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: a b;\n}\n');
});

// Test compiling SASS from file
test('compileSassFromOptions with file', (t) => {
    const options = {
        data: undefined,
        file: getFilePath('test.scss'),
        intendedSyntax: false,
        includePaths: []
    };
    const result = compileSassFromOptions(options);
    t.is(result, readExpectedOutput('test.css'));
});

// Test compiling SASS with include paths
test('compileSassFromOptions with includePaths', (t) => {
    const options = {
        data: '@import "variables"; a { b { color: $text-color; } }',
        file: undefined,
        includePaths: ['__test__/fixtures/scss']
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: #333;\n}\n'); 
});

// Test compiling SASS with sass syntax
test('compileSassFromOptions with intendedSyntax', (t) => {
    const options = {
        data: 'a\n  b\n    color: red ',
        file: undefined,
        sassSyntax: SassSyntax.Sass,
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: red;\n}\n'); 
});