import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[regExpMatchOnly]',
})
export class RegExpMatchOnlyDirective {
  constructor(private _elementRef: ElementRef) { }
  
  @HostListener('input', ['$event']) 
  onInputChange(event:any) {
    //Filter the value
    const originalValue = this._elementRef.nativeElement.value;
    this._elementRef.nativeElement.value = originalValue.replace(new RegExp('[^' + this.regExpMatchOnly + ']', 'g'), '');
  }

  @Input() regExpMatchOnly:string = '';
}
