import { Component, EventEmitter, Input, Output, Attribute, ElementRef, OnDestroy, OnInit} from '@angular/core';
import { CardComponent } from './card.component';
import { CardService } from './card.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'card-view',
  template: `
    <!-- when a child calls to register a card -->
  `,
  providers: [CardService]
})
export class CardViewComponent implements OnDestroy {
  private id: string;
  private cards: Array<any>;
  private cardService: CardService;
  private cardRegisterSubscription: Subscription;
  /** Get the values from the dom attributes since this is a top level component. 
   * if needed, get the attributes from top level component here and set on this.
   * var native = this.elementRef.nativeElement;
   * this.id = native.getAttribute("id");
   */
  constructor(public elementRef: ElementRef, cardService: CardService) {
    this.cardService = cardService;
    this.cards = new Array<any>();
    
    //Subscribe to register events from the child.
    this.cardRegisterSubscription = this.cardService.cardRegisterAnnounced$.subscribe(
      //next
      card => {
        console.log("Pushing Card: ", card);
        this.cards.push(card);
      },
      //error
      error => {
        console.log("Error registering card", error);
      })
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.cardRegisterSubscription.unsubscribe();
  }
}