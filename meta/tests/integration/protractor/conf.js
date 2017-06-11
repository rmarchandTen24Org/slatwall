var fs = require('fs');
var path = require('path');

var evnPath = path.join(__dirname, 'env.json');
var env = JSON.parse(fs.readFileSync(evnPath,'utf8'));

exports.config = {
  	seleniumAddress: 'http://localhost:4444/wd/hub',
  	specs: ['./src/**/*.spec.js'],
  	capabilities: {
  		browserName: 'chrome',
		chromeOptions: {
			args: ['show-fps-counter=true']
		}
	},
	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
    	showColors: true, // Use colors in the command line report.
	},
	onPrepare: function() {
		//browser.ignoreSynchronization = true;
	    browser.driver.get(env.baseUrl + '?slatAction=main.login');
		browser.angularAppRoot.value = browser.driver.findElement(by.id('ngApp'));
	    browser.driver.findElement(by.name('emailAddress')).sendKeys(env.emailAddress);
	    browser.driver.findElement(by.name('password')).sendKeys(env.password);
	    browser.driver.findElement(by.css('button')).click();
		browser.ignoreSynchronization = true;

	    // Login takes some time, so wait until it's done.
	    // For the test app's login, we know it's done when it redirects to
	    // dashboard
	    return browser.driver.wait(function() {
	      return browser.driver.getCurrentUrl().then(function(url) {
	        return element(by.id('ngApp')).isPresent();
	      });
	    }, 30000);
	},
	onComplete: function(){
		//on complete logout
		browser.driver.get(env.baseUrl + '?slatAction=main.logout');
	}
};