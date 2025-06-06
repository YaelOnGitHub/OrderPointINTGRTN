import { Directive, ContentChild, ElementRef, Optional } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: 'input[formControlName], select[formControlName], textarea[formControlName]'
})
export class FormFieldInputDirective {

  constructor(public elementRef: ElementRef, @Optional() public formControlName?: FormControlName) { }  

}
