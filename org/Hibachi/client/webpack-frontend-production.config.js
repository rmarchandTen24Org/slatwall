//webpack --config webpack-production.config.js -p

var WebpackStrip = require('strip-loader');
var productionConfig = require('./webpack.config');

//points to the bootstrap located in the frontend modules directory.
productionConfig.app.entry = "./src/frontend/bootstrap.ts";
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var stripConsolelogs = {
	exlude: /node_modules/,
	loader: WebpackStrip.loader('console.log')
}
//extend and override the devconfig
productionConfig.module.loaders.push(stripConsolelogs);

var stripLogDebugs = {
	exlude: /node_modules/,
	loader: WebpackStrip.loader('$log.debug')
}
//extend and override the devconfig
productionConfig.module.loaders.push(stripLogDebugs);


productionConfig.plugins= [
  	new ngAnnotatePlugin({
        add: true,
        // other ng-annotate options here 
    })
  ];
//change output filename
productionConfig.output.filename = "slatwall_frontend_pro.min.js";
module.exports = productionConfig;