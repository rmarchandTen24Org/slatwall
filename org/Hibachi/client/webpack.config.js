var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');


var path = require('path');
var PATHS = {
    app: path.join(__dirname, '/src'),
    lib: path.join(__dirname, '/lib')
};

var appConfig = {
    context:PATHS.app,
    entry: {
        vendor:[PATHS.lib+'/vendor.ts'],
        app:['./bootstrap.ts']
    },
    watch:true,
    output: {
        path: PATHS.app,
        filename: '[name].bundle.js',
    },
    // Turn on sourcemaps
    //devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.json'],
        alias:{}
    },
    module: {
        noParse: [ /bower_components/ ],
        loaders: [
            {
                test: /\.ts$/, loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/, loader: 'json-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ForceCaseSensitivityPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
        	name:"vendor",
        	filename:"vendor.bundle.js",
            minChunks: Infinity
        })

    ],
    setupApp: function(customPath, bootstrap){
        PATHS = {
            app: path.join(customPath, '/src'),
            lib: path.join(customPath, '/lib')
        };
        if(typeof bootstrap !== 'undefined'){
            this.entry.app[this.entry.app.length - 1] = bootstrap;
        }
        this.output.path = PATHS.app;
        this.context = PATHS.app;
        return this;
    },
    setOutputName: function(outputName){
        this.output.filename = outputName;
        return this;
    },
    addVendor: function (name, vendorPath) {
        this.resolve.alias[name] =  path.join(PATHS.lib, vendorPath);
        this.entry.vendor.splice(this.entry.vendor.length - 1, 0, name);
        return this;
    },
    addPlugin: function(plugin){
        this.plugins.push(plugin);
        return this;
    },
    addLoader: function(loader){
        this.module.loaders.push(loader);
        return this;
    }

};
appConfig
;
module.exports = appConfig;