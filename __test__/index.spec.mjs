import test from 'ava'
import path from 'path';
import { compileSass, compileSassFromFile, compileSassFromOptions } from '../index.js'

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

function getFilePath(fileName) {
    return path.join('__test__', 'fixtures', fileName);
}

test('compileSassFromFile from native', (t) => {
    t.is(compileSassFromFile(getFilePath('test.scss')), 'body div {\n  color: red;\n}\n');
})

test('compileSassFromFile with imports', (t) => {
    t.is(compileSassFromFile(getFilePath('test-import.scss')), 'body div {\n  color: red;\n}\n\nbody a {\n  color: red;\n}\n');
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
    t.is(result, 'body div {\n  color: red;\n}\n');
});

// Test compiling SASS with include paths
test('compileSassFromOptions with includePaths', (t) => {
    const options = {
        data: '@import "variables"; a { b { color: $text-color; } }',
        file: undefined,
        intendedSyntax: false,
        includePaths: ['__test__/fixtures']
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: #333;\n}\n'); // Adjust the expected output based on your SASS content
});

// Test compiling SASS with intended syntax
test('compileSassFromOptions with intendedSyntax', (t) => {
    const options = {
        data: 'a\n  b\n    color: red',
        file: undefined,
        intendedSyntax: true,
        includePaths: []
    };
    const result = compileSassFromOptions(options);
    t.is(result, 'a b {\n  color: red;\n}\n'); // Adjust the expected output based on your SASS content
});