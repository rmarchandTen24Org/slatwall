
var path = require('path');
var PATHS = {
    app: path.join(__dirname, '/src'),
    lib: path.join(__dirname, '/lib')
};

var appConfigService = {
	addVendor: function (appConfig,name, vendorPath) {
        appConfig.resolve.alias[name] =  path.join(PATHS.lib, vendorPath);
        appConfig.entry.app.splice(appConfig.entry.app.length - 1, 0, name);
        return this;
    },
}

var devConfig = require('../../org/Hibachi/client/webpack2.config');
devConfig.output.path=PATHS.app;


appConfigService.addVendor(devConfig,'jquery-ui-timepicker-addon','../../HibachiAssets/js/jquery-ui-timepicker-addon-1.3.1.js')
.addVendor(devConfig,'jquery-typewatch','../../HibachiAssets/js/jquery-typewatch-2.0.js')
;
devConfig.entry.app=__dirname + "/src/bootstrap.ts";
module.exports = devConfig;
//.setupApp(__dirname);