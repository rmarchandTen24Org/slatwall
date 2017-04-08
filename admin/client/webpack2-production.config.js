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


 devConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }

}));

module.exports = devConfig;

