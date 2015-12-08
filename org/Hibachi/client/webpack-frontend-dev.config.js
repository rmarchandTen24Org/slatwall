//webpack --config webpack-production.config.js -p

var WebpackStrip = require('strip-loader');
var devConfig = require('./webpack.config');
//points to the bootstrap located in the frontend modules directory.
devConfig.app.entry = "./src/frontend/bootstrap.ts";
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

devConfig.plugins= [
    new ngAnnotatePlugin({
        add: false,
        // other ng-annotate options here 
    })
  ];
//change output filename
devConfig.output.filename = "slatwall_frontend_dev.js";
module.exports = devConfig;