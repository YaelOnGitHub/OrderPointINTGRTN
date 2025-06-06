import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { TitlebarComponent } from '../titlebar/titlebar.component';

//TODO: Follow pattern with actions to complete this
@Component({
  selector: 'ytbe-modal-titlebar',
  templateUrl: '../titlebar/titlebar.component.html',
  styleUrls: [],
  host: { class:'y-modal-titlebar y-titlebar'},
  encapsulation: ViewEncapsulation.None
})
export class ModalTitlebarComponent extends TitlebarComponent implements OnInit {

  constructor(protected override hostRef: ElementRef, protected override renderer: Renderer2) {
    super(hostRef, renderer);
    this.titlebarType = "modal";
  }
}
