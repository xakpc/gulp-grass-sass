const path = require('path');
const { Transform } = require('stream');
const PluginError = require('plugin-error');

const { compileSass, compileSassFromFile, compileSassFromOptions } = require('./index.js');

const { SassSyntax, SassOutputStyle } = require('./index.js');

const PLUGIN_NAME = '@xakpc/gulp-grass-sass';

function replaceExtension(filePath, ext) {
    return (typeof filePath !== 'string' || filePath.length === 0) ?
        filePath :
        path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + ext);
}

function compile(options = {}) {
    function transform(file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        
        if (file.isStream()) {
            callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        // Skip files starting with underscores, Sass convention says files beginning with an underscore should be used via @import only
        if (path.basename(file.path).startsWith('_')) {
            callback();
            return;
        }

        // Skip empty files
        if (!file.contents.length) {
            file.path = replaceExtension(file.path, '.css');
            callback(null, file);
            return;
        }

        // prepare options
        const sassOptions = { ...(options || {}) };

        // set both data and path, data would be processed first
        sassOptions.data = file.contents.toString();       
        sassOptions.file = file.path;

        // Set output style to sass if the file extension is .sass
        if (path.extname(file.path) === '.sass') {
            sassOptions.outputStyle = SassSyntax.sass;
        }

        // Ensure file's parent directory in the include path ???
        //if (sassOptions.includePaths) {
        //    if (typeof sassOptions.includePaths === 'string') {
        //        sassOptions.includePaths = [sassOptions.includePaths];
        //    }
        //} else {
        //    sassOptions.includePaths = [];
        //}

        if (!sassOptions.includePaths) {
            sassOptions.includePaths = [];
        }

        sassOptions.includePaths.unshift(file.base);

        try {
            //console.log(sassOptions);
            let result = compileSassFromOptions(sassOptions);

            if (!result) {
                return callback(new PluginError(PLUGIN_NAME, 'No internal failures, but missing stylesheet result'))
            }

            file.contents = Buffer.from(result);
            file.path = replaceExtension(file.path, '.css');

            if (file.stat) {
                file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
            }

            return callback(null, file);
        } catch (error) {
            return callback(error);
        }
    }

    return new Transform({ transform, readableObjectMode: true, writableObjectMode: true })
}

module.exports = compile;