import { Component, EventEmitter, Input, Output, Attribute, ElementRef, OnInit, OnDestroy} from '@angular/core';
import { CardService } from './card.service';

@Component({
  selector: 'card',
  template: `
    <div id="{{id}}" class="s-{{blockSize}}-content-block{{inner}}" style="margin-bottom:7px">                
      <card-icon icon="{{icon}}" *ngIf="icon"></card-icon>
      <card-title title="{{name}}" *ngIf="name"></card-title>
      <card-body body="{{body}}" *ngIf="body"></card-body>
    </div>
  `,
  providers: [CardService]
})
export class CardComponent implements OnInit {
  //public
  @Input()
  public name: string;
  @Input()
  public body: string;
  @Input()
  public icon: string;
  @Input()
  public id: string;
  public cardService: CardService;

  //private 
  private blockSize: string = 'md';
  private useInner: boolean = true;
  private inner: string = '';
  
  /** Get the values from the dom attributes since this is a top level component. */
  constructor(ref: ElementRef, cardService: CardService) {
    var native = ref.nativeElement;
    this.name = native.getAttribute("name");
    this.body = native.getAttribute("body");
    this.icon = native.getAttribute("icon");
    this.blockSize = (this.icon == undefined) ? 'md' : 'sm' ;
    this.useInner = this.blockSize == 'md';
    if (this.useInner) {
      this.inner = '-inner';
    }
    this.cardService = cardService;
    console.log("Init announce card");
    this.cardService.announceCard({
      name: this.name,
      body: this.body,
      icon: this.icon,
      blockSize: this.blockSize,
      useInner: this.useInner
    });
  }

  ngOnInit(): void {
    
  }
}