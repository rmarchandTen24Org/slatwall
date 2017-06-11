

import {browser,by,element} from "protractor";
import {menuPage} from "./menudropdown";

describe('Menu Items', ()=> {
    beforeEach(()=>{
        browser.waitForAngularEnabled();
    });
    it('should click collections item', function() {
        var _menuPage = new menuPage();
        _menuPage.clickMenuItem('config').then(()=>{
            _menuPage.clickMenuItem('collections').then(()=>{
                expect(browser.getCurrentUrl()).toContain("entity.collections");
                console.log(browser.getCurrentUrl());
            });
        });
    })
});

export{
    menuPage
}