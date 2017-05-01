import { Component, EventEmitter, Input, Output, Attribute, ElementRef} from '@angular/core';

@Component({
  selector: 'card-icon',
  template: `
    <div class="col-xs-1 col-sm-1 col-md-2 col-lg-2 s-icon">
        <i class="fa fa-{{icon}} fa-2"></i>
    </div>
  `
})
export class CardIconComponent {
  @Input() icon: string;
}