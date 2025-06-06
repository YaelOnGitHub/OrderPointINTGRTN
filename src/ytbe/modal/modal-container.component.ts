import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ElementRef, Renderer2 } from '@angular/core';
import { ModalContainerService } from './modal-container.service';

@Component({
  selector: 'ytbe-modal-container',
  template: '<ng-container #container></ng-container>',
  styleUrls: [],
  host: {
    'class': 'y-modal-container'
  },
  encapsulation: ViewEncapsulation.None,
})
export class ModalContainerComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef, static:true }) vc?: ViewContainerRef;

  constructor(private containerService: ModalContainerService, protected hostRef: ElementRef, protected renderer: Renderer2) {
    this.containerService.hostRef = hostRef;
    this.containerService.renderer = renderer;
  }

  ngOnInit() {
    this.containerService.vc = this.vc; //Register the container
    this.containerService.ready.next(undefined);
  }

}
