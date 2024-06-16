import test from 'ava';
import path from 'path';
import Vinyl from 'vinyl';
import compile from '../main.js';
import { SassSyntax, SassOutputStyle } from '../index.js';
import fs from 'fs';

function readExpectedOutput(expectedOutputFileName) {
    return fs.readFileSync(getExpectedPath(expectedOutputFileName), 'utf8');
}

function getExpectedPath(fileName) {
    return path.join('__test__', 'fixtures', 'expected', fileName);
}

function getFilePath(fileName) {
    return path.join('__test__', 'fixtures', 'scss', fileName);
}

async function testCompile(options, inputFileName) {
    const transformStream = compile(options);
    const readFileAsVinyl = (filePath) => {
        const contents = fs.readFileSync(getFilePath(filePath));
        return new Vinyl({
            cwd: process.cwd(),
            base: path.dirname(filePath),
            path: filePath,
            contents: contents
        });
    };

    let result = '';

    transformStream.on('data', (file) => {
        result = file.contents.toString();
    });

    transformStream.write(readFileAsVinyl(inputFileName));
    transformStream.end();

    await new Promise((resolve, reject) => {
        transformStream.on('end', resolve);
        transformStream.on('error', reject);
    });

    return result;
}

test('compile simple file', async (t) => {
    const options = {
        outputStyle: SassOutputStyle.Expanded
    };

    var actual = await testCompile(options, 'plain.scss');
    var expected = readExpectedOutput('plain.css');

    t.is(actual, expected);
})

test('compile simple file compressed', async (t) => {
    const options = {
        outputStyle: SassOutputStyle.Compressed
    };

    var actual = await testCompile(options, 'plain.scss');
    var expected = readExpectedOutput('plain-compressed.css');

    t.is(actual, expected);
})

test('compile with good import', async (t) => {
    const options = {
        includePaths: [path.join('__test__', 'fixtures', 'scss')]
    };

    var actual = await testCompile(options, 'test-import.scss');
    var expected = readExpectedOutput('test-import.css');

    t.is(actual, expected);
})

// test is broken
//test('compile with bad import', async (t) => {
//    const options = {
//        includePaths: [path.join('__test__', 'fixtures', 'scss')]
//    };
//    await testCompile(options, 'test-import.scss');
//    //const error = await t.throwsAsync(async () => {
        
//    //}, { instanceOf: Error });

//    //t.true(error.message.includes('Can\'t find stylesheet to import'), 'Error message should contain "Can\'t find stylesheet to import"');
//})