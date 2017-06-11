"use strict";
var helpers = require("protractor-helpers");
function testElementArrayFinder() {
    var single1 = $$('.foo').getByText('Hello');
    var multiple = $$('.foo').$$data('Hello');
}
function testElementFinder() {
    var single2 = $('.foo').$data('Hello');
}
function testGlobals() {
    var single = $data('Hello');
    var multiple = $$data('Hello');
}
function testHelpers() {
    var q0 = helpers.not($('.foo').isDisplayed());
    // TODO - Check impl
    var q1 = helpers.translate(["foo", "bar"]);
    var q2 = helpers.translate(["foo", "bar"], { name: 'foo' });
    var q3 = helpers.translate("foo");
    var q4 = helpers.translate("foo", { name: 'foo' });
    helpers.safeGet('https://foo/');
    helpers.maximizeWindow(500, 500);
    helpers.maximizeWindow(500);
    helpers.maximizeWindow(undefined, 500);
    helpers.maximizeWindow();
    helpers.resetPosition();
    helpers.moveToElement(".foo"); // TODO - ?
    helpers.displayHover($('.foo'));
    helpers.waitForElement($('.foo'));
    helpers.waitForElement($('.foo'), 1000);
    helpers.waitForElementToDisappear($('.foo'));
    ;
    helpers.waitForElementToDisappear($('.foo'), 1000);
    helpers.selectOptionByText($('select'), "GB");
    helpers.selectOptionByIndex($('select'), 1);
    helpers.selectOption($$('select option').first());
    var ff = helpers.isFirefox();
    var ie = helpers.isIE();
    var msg = helpers.createMessage("actual", "message", true);
    var msg = helpers.createMessage($('.foo'), "message", true);
    var msg = helpers.createMessage($$('.foo'), "message", true);
    helpers.clearAndSetValue($('input'), 'Foo');
    var hc = helpers.hasClass($('.foo'), 'foo');
    var hv = helpers.hasValue($('input[type=text]'), 'foo');
    var hv1 = helpers.hasValue($('input[type=numeric]'), 12);
    var hl = helpers.hasLink($('div'), 'http://foo.com');
    var disabled = helpers.isDisabled($('foo'));
    var checked = helpers.isChecked($('foo'));
    var q5 = helpers.getFilteredConsoleErrors();
}
function testLocators() {
    element(by.dataHook("foo"));
    element(by.dataHook("foo", $('.parentfoo')));
    element(by.dataHook("foo", undefined, ".foo"));
    element(by.dataHook("foo", $('.parentfoo'), ".foo")); // TODO - This might not make much sense, but can technically be used in working code. Opinions welcome
    element.all(by.dataHook("foo"));
    element.all(by.dataHook("foo", $('parentfoo')));
    element.all(by.dataHook("foo", undefined, ".foo"));
    element.all(by.dataHook("foo", $('parentfoo'), ".foo")); // TODO - This might not make much sense, but can technically be used in working code. Opinions welcome
}
function testMatchers() {
    var expectResult;
    expectResult = expect($('.foo')).toBePresent();
    expectResult = expect($('.foo')).toBeDisplayed();
    expectResult = expect($$('.foo').count()).toHaveCountOf(1);
    expectResult = expect($('.foo')).toHaveText("bla");
    expectResult = expect($('.foo')).toMatchRegex(/bla/);
    expectResult = expect($('.foo').getText()).toMatchMoney(123, "£");
    expectResult = expect($('.foo').getText()).toMatchMoneyWithFraction(123.45, "£");
    expectResult = expect($('input')).toHaveValue(12);
    expectResult = expect($('input')).toHaveValue("bla");
    expectResult = expect($('.foo')).toHaveClass("foo");
    expectResult = expect($('.foo')).toHaveUrl('https://foo.com');
    expectResult = expect($('.foo')).toBeDisabled();
    expectResult = expect($('.foo')).toBeChecked();
    expectResult = expect($('.foo')).toBeValid();
    expectResult = expect($('.foo')).toBeInvalid();
    expectResult = expect($('.foo')).toBeInvalidRequired();
    expectResult = expect($('.foo')).toMatchTranslated("foo");
    expectResult = expect($('.foo')).toMatchTranslated("foo", { foo: "bar" });
    expectResult = expect($('.foo')).toMatchTranslated(["foo"]);
    expectResult = expect($('.foo')).toMatchTranslated(["foo", "bla"], { foo: "bar" });
}
