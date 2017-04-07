var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');

var path = require('path');
var PATHS = {
    app: path.join(__dirname, '/src'),
    lib: path.join(__dirname, '/lib')
};

var appConfigService={
    setupApp: function(customPath, bootstrap){
        PATHS = {
            app: path.join(customPath, '/src')
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
    addVendor: function (appConfig,name, vendorPath) {
        appConfig.resolve.alias[name] =  path.join(PATHS.lib, vendorPath);
        appConfig.entry.app.splice(appConfig.entry.app.length - 1, 0, name);
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
}

var appConfig = {
    //context:PATHS.app,
    entry: {
        app:['./bootstrap.ts']
    },
    watch:true,
    output: {
        path: PATHS.app,
        filename: 'bundle.js'
    },
    // Turn on sourcemaps
    //devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.json'],
        alias:{}
    },
    module: {
        noParse: [ /bower_components/ ],
        rules: [

            { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    plugins: [
        new ForceCaseSensitivityPlugin()
    ]


};
module.exports = appConfig;