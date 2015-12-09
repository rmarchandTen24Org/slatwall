//webpack --config webpack-production.config.js -p

var WebpackStrip = require('strip-loader');
var devConfig = require('./webpack.config');
devConfig.entry.app = "./frontend/bootstrap.ts";
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var stripConsolelogs = {
	exlude: /node_modules/,
	loader: WebpackStrip.loader('console.log')
}
//extend and override the devconfig
devConfig.module.loaders.push(stripConsolelogs);

var stripLogDebugs = {
	exlude: /node_modules/,
	loader: WebpackStrip.loader('$log.debug')
}
//extend and override the devconfig
devConfig.module.loaders.push(stripLogDebugs);

devConfig.plugins= [
  	new ngAnnotatePlugin({
        add: true,
        // other ng-annotate options here 
    })
  ];
//change output filename
devConfig.output.filename = "slatwall_frontend_production.min.js";
module.exports = devConfig; 

