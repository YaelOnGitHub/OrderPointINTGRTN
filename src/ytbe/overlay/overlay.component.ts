import { Optional, ViewEncapsulation, Component, OnInit } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'ytbe-overlay',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'y-overlay'
  },
  encapsulation: ViewEncapsulation.None
})
export class OverlayComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
