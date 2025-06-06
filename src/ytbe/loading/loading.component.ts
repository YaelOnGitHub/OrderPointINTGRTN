import { Component, OnInit, ViewEncapsulation, ContentChild, ElementRef } from '@angular/core';
import { LoadingCustomDirective } from './loading-custom.directive';

@Component({
  selector: 'ytbe-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  host: { 'class': 'y-loading' },
  encapsulation: ViewEncapsulation.None
})
export class LoadingComponent implements OnInit {
  
  /**
   * Reference to custom loading control 
   */
  @ContentChild(LoadingCustomDirective, { static: true }) loadingCustom?: LoadingCustomDirective;

  constructor() { }

  ngOnInit() {
  }

}
