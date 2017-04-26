var devConfig = require('../../org/Hibachi/client/webpack.config');
var path = require('path');
devConfig.output.path = __dirname+'/src';
devConfig.entry.app = __dirname+'/src/bootstrap.ts';
devConfig.entry.vendor.push(__dirname+'/lib/vendor.ts')
;
module.exports = devConfig;