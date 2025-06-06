import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[uppercase]',
})
export class UpperCaseDirective {
  constructor(private _elementRef: ElementRef) { }
  
  @HostListener('input', ['$event']) 
  onInputChange(event:any) {
    //Filter the value
    const originalValue = this._elementRef.nativeElement.value;
    this._elementRef.nativeElement.value = originalValue.toUpperCase();
  }
}
