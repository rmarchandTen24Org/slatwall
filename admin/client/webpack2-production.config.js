//webpack --config webpack-production.config.js -p
var webpack = require('webpack');

var WebpackStrip = require('strip-loader'),
    devConfig = require('./webpack2.config'),
    ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

 devConfig.watch = false;
devConfig.output.sourceMapFilename= '[name].map';
 devConfig.module.rules.push({exclude: /node_modules/, loader: WebpackStrip.loader('console.log')});
 devConfig.module.rules.push({ exclude: /node_modules/,  loader: WebpackStrip.loader('$log.debug') });
 devConfig.plugins.push(new ngAnnotatePlugin({ add: true }));

//devConfig.devtool('source-map');
 devConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
        screw_ie8: true,
        keep_fnames: true
    },
    compress: {
        unused: true,
        dead_code: true, // big one--strip code that will never execute
        warnings: false, // good for prod apps so users can't peek behind curtain
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true, // strips console statements
        sequences: true,
        booleans: true,
        screw_ie8: true
    },
    sourceMap:true,
    comments: false

}));

module.exports = devConfig;

