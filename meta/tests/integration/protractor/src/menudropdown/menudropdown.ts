

import { browser, by, element } from 'protractor';
var env = require('../../env.json');

class menuPage {
    public menuItems = {
 		collections:element(by.cssContainingText('#j-mobile-nav > ul > li.dropdown.open > ul > a','Collections')),
        config:element(by.cssContainingText('#j-mobile-nav > ul > li.dropdown.open > a > i','Config'))
 	}

     constructor(){

     }

     public clickMenuItem = (menuItemName:string)=>{
        return this.menuItems[menuItemName].click();
     }
};

export{
    menuPage
}