import { Component, OnInit, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ToolbarPosition } from '../toolbar/toolbar-position.enum';

@Component({
  selector: 'ytbe-modal-actions',
  template: '<ng-content></ng-content>',
  styleUrls: [],
  host: {
    class:'y-modal-actions y-toolbar'},
  encapsulation: ViewEncapsulation.None
})
export class ModalActionsComponent extends ToolbarComponent implements OnInit {

  constructor(protected override hostRef: ElementRef, protected override renderer: Renderer2) {
    super(hostRef, renderer);
    this.position = ToolbarPosition.bottom; //Modal actions are positioned at bottom of modal
  }

}
