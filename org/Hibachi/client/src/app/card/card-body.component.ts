import { Component, EventEmitter, Input, Output, Attribute, ElementRef} from '@angular/core';

@Component({
  selector: 'card-body',
  template: `
    <div class="s-body">{{body}}</div>
  `
})
export class CardBodyComponent {
  @Input('body') body: string;
}