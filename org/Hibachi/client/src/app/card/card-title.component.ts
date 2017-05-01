import { Component, EventEmitter, Input, Output, Attribute, ElementRef} from '@angular/core';

@Component({
  selector: 'card-title',
  template: `
    <div class="s-title" >{{title}}</div>
  `
})
export class CardTitleComponent {
  @Input() title: string;
}