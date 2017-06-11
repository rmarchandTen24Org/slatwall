"use strict";
var protractor_1 = require("protractor");
var env = require('../../env.json');
var menuPage = (function () {
    function menuPage() {
        var _this = this;
        this.menuItems = {
            collections: protractor_1.element(protractor_1.by.cssContainingText('#j-mobile-nav > ul > li.dropdown.open > ul > a', 'Collections')),
            config: protractor_1.element(protractor_1.by.cssContainingText('#j-mobile-nav > ul > li.dropdown.open > a > i', 'Config'))
        };
        this.clickMenuItem = function (menuItemName) {
            return _this.menuItems[menuItemName].click();
        };
    }
    return menuPage;
}());
exports.menuPage = menuPage;
;
