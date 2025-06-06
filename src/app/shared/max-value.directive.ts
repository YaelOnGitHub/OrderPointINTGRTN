import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxValue]'
})
export class MaxValueDirective {
  @Input('appMaxValue') maxValue: number = 0; // Initialize with a default value

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value <= 0) {
      value = 1; // Set value to 1 if it's NaN or <= 0
    } else if (value > this.maxValue) {
      value = this.maxValue; // Limit value to maxValue
    }
    input.value = value.toString();
  }
}
