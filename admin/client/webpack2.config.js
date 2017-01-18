
var path = require('path');
var devConfig = require('../../org/Hibachi/client/webpack2.config');
console.log(devConfig);
//devConfig.addVendor('jquery-ui-timepicker-addon','../../HibachiAssets/js/jquery-ui-timepicker-addon-1.3.1.js')
   // .addVendor('jquery-typewatch','../../HibachiAssets/js/jquery-typewatch-2.0.js')
//;
devConfig.entry.app=__dirname + "/src/bootstrap.ts";
module.exports = devConfig;
//.setupApp(__dirname);