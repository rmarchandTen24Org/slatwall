var webpack = require('webpack');

var path = require('path');
var PATHS = {
    app: path.join(__dirname, '/src'),
    lib: path.join(__dirname, '/lib')
};

var appConfig = {
    context:PATHS.app,
    entry: {
        app:['./alltests.ts']
    },
    watch:false,
    output: {
        path: PATHS.app,
        filename: 'protractor-bundle.js'
    },
    // Turn on sourcemaps
    //devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        alias:{}
    },
    module: {
        noParse: [ /bower_components/ ],
        loaders: [
            {
                test: /\.ts$/, loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [

    ]
};

;
module.exports = appConfig;