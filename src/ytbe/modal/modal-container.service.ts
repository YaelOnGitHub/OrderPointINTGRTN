import { Injectable, ViewContainerRef, ElementRef, Renderer2 } from "@angular/core";
import {  ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalContainerService {
  /** Reference to the view container for the Side Menu Container */
  vc?: ViewContainerRef;
  hostRef?: ElementRef;
  renderer?: Renderer2;

  ready: ReplaySubject<any> = new ReplaySubject<any>(1);
}
