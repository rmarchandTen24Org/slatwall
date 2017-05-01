/// <reference path="../../../../../node_modules/typescript/lib/lib.es6.d.ts" />
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { AppComponent  } from './app.component';

//Cards
import { CardViewComponent  } from './card/card-view.component'; //root component and secondary entry way into application
import { CardComponent  } from './card/card.component';
import { CardBodyComponent  } from './card/card-body.component';
import { CardTitleComponent  } from './card/card-title.component';
import { CardIconComponent  } from './card/card-icon.component';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  declarations: [AppComponent, CardViewComponent, CardComponent, CardTitleComponent, CardIconComponent, CardBodyComponent],
  bootstrap:    [AppComponent, CardComponent],
  entryComponents: [
    AppComponent,
    CardComponent
  ]
})
export class AppModule {
  constuctor(upgrade: UpgradeModule){
    upgrade.bootstrap(document.body, ['ngApp'], {strictDi: true});
  }
}