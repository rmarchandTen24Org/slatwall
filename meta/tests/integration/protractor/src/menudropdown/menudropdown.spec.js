"use strict";
var protractor_1 = require("protractor");
var menudropdown_1 = require("./menudropdown");
exports.menuPage = menudropdown_1.menuPage;
describe('Menu Items', function () {
    beforeEach(function () {
        protractor_1.browser.waitForAngularEnabled();
    });
    it('should click collections item', function () {
        var _menuPage = new menudropdown_1.menuPage();
        _menuPage.clickMenuItem('config').then(function () {
            _menuPage.clickMenuItem('collections').then(function () {
                expect(protractor_1.browser.getCurrentUrl()).toContain("entity.collections");
                console.log(protractor_1.browser.getCurrentUrl());
            });
        });
    });
});
