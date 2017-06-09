import { by, element } from 'protractor';

class menuPage {
    public menuItems = {
 		collections:element(by.cssContainingText('#j-mobile-nav > ul > li.dropdown.open > ul > a','Collections'))
 	}

     constructor(){

     }

     public clickMenuItem = (menuItemName:string)=>{
        this.menuItems[menuItemName].click();
     }
};