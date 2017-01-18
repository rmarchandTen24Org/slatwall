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
    context:PATHS.app,
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
        new ForceCaseSensitivityPlugin()
    ]


};
appConfigService
    .addVendor(appConfig,'date','date/date.min.js')
    .addVendor(appConfig,'angular','angular/angular.min.js')
    .addVendor(appConfig,'angular-lazy-bootstrap','angular-lazy-bootstrap/bootstrap.js')
    .addVendor(appConfig,'ui.bootstrap','angular-ui-bootstrap/ui.bootstrap.min.js')
    .addVendor(appConfig,'angular-resource','angular/angular-resource.min.js')
    .addVendor(appConfig,'angular-cookies','angular/angular-cookies.min.js')
    .addVendor(appConfig,'angular-route','angular/angular-route.min.js')
    .addVendor(appConfig,'angular-animate','angular/angular-animate.min.js')
    .addVendor(appConfig,'angular-sanitize','angular/angular-sanitize.min.js')
    .addVendor(appConfig,'metismenu','metismenu/metismenu.js')
    .addVendor(appConfig,'angularjs-datetime-picker','angularjs-datetime-picker/angularjs-datetime-picker.js')


;
module.exports = appConfig;