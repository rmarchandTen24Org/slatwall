"use strict";
var built_1 = require("protractor/built");
var protractor_browser_logs_1 = require("protractor-browser-logs");
function colored(entries) {
    var colors = { INFO: 35 /* magenta */, WARNING: 33 /* yellow */, SEVERE: 31 /* red */ };
    entries.forEach(function (entry) {
        console.log('\u001b[' + (colors[entry.level.name] || 37) + 'm' + [entry.level.name, entry.message].join(': ') + '\u001b[39m');
    });
}
function testCreateFunction() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs = protractor_browser_logs_1["default"](built_1.browser, { reporters: [] });
    logs = protractor_browser_logs_1["default"](built_1.browser, { reporters: [colored] });
}
function testLogLevels() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.ignore(logs.ERROR);
    logs.expect(logs.WARNING);
    logs.ignore(logs.DEBUG);
    logs.expect(logs.INFO);
    logs.ignore(logs.LOG);
}
function testPredicateFunctions() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.ignore(logs.or(logs.ERROR, logs.WARNING));
    logs.expect(logs.and(logs.DEBUG, logs.INFO));
}
function testRegExp() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.ignore(/foo/i);
    logs.expect(new RegExp('/foo/i'));
}
function testString() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.ignore('foo');
    logs.expect('foo');
}
function testMatchFunction() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    var filter = function (entry) { return entry.message === "foo"; };
    logs.ignore(filter);
    logs.expect(filter);
}
function testReset() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.reset();
}
function testLogs() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    var entries = logs.logs();
}
function testVerify() {
    var logs = protractor_browser_logs_1["default"](built_1.browser);
    logs.verify();
}
