var devConfig = require('../../org/Hibachi/client/webpack.config');
devConfig.entry.app = ['./test.ts'];
devConfig.watch = true;
var ngTemplateLoader = {
  test: /\.html$/,
  loader: 'ngtemplate!html'
};
devConfig.module.loaders.push(ngTemplateLoader);

devConfig.addVendor('jquery-ui-timepicker-addon','../../HibachiAssets/js/jquery-ui-timepicker-addon-1.3.1.js')
  .addVendor('jquery-typewatch','../../HibachiAssets/js/jquery-typewatch-2.0.js')
;
devConfig.output.filename = 'testbundle.js';
module.exports = devConfig.setupApp(__dirname);