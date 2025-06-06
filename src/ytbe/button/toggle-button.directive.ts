import { Directive, Input, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { ButtonDirective } from './button.directive';
import { AnimationBuilder } from '@angular/animations';

@Directive({
  selector: '[ytbeToggleButton]'
})
export class ToggleButtonDirective extends ButtonDirective {
  private _selected: boolean = false;

  /**
   * Fires when the selection state of the button changes
   */
  @Output() selChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get selected(): boolean {
    return this._selected;
  }
  @Input() set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.renderer.addClass(this.hostRef.nativeElement, 'y-sel');
    } else {
      this.renderer.removeClass(this.hostRef.nativeElement, 'y-sel');
    }
    this.selChange.next(value);
  }

  constructor(protected override hostRef: ElementRef, protected override renderer: Renderer2, protected override animationBuilder: AnimationBuilder) {
    super(hostRef, renderer, animationBuilder);
    const self = this;

    this.renderer.addClass(this.hostRef.nativeElement, 'y-btn-toggle');

    // Listen to click events in the component
    renderer.listen(hostRef.nativeElement, 'click', (event) => {
      this.selected = !this.selected; //Toggle
    })
  }
}
