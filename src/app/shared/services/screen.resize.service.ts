import { Injectable } from "@angular/core";
import { distinctUntilChanged, Observable, Subject } from "rxjs";
import { SCREEN_SIZE } from "src/ytbe/css/screen-size.enum";

@Injectable({
  providedIn: 'root'
})

export class ResizeService {

  get onResize$(): Observable<SCREEN_SIZE> {
    return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
  }

  get onLoad$(): Observable<SCREEN_SIZE> {
    return this.defaultSizeSubject.asObservable();
  }

  private resizeSubject: Subject<SCREEN_SIZE>;
  private defaultSizeSubject: Subject<SCREEN_SIZE>;
  
  constructor() {    
    this.resizeSubject = new Subject();
    this.defaultSizeSubject = new Subject();
  }

  onResize(size: SCREEN_SIZE) {        
    this.resizeSubject.next(size);
  }

  onLoad(size: SCREEN_SIZE) {      
    this.defaultSizeSubject.next(size);
  }
}