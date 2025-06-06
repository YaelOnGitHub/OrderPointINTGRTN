import { Directive, Input, ElementRef, Renderer2, HostBinding, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { setCssClass } from '../css/operators';
import { ButtonType } from './button-type.eum';
import { AnimationBuilder, style, animate, AnimationFactory, AnimationOptions, AnimationPlayer } from '@angular/animations';

@Directive({
  selector: '[ytbeButton]',
})
export class ButtonDirective implements OnInit, AfterViewInit {
  /** The value of the directive serves as the label for the button */
  @HostBinding('class.y-btn') @Input() set ytbeButton(value: string) {
    this.text = value;
  }

  private _text: string = '';
  private _icon: string = '';
  private _buttonType: ButtonType = ButtonType.basic;
  private _labelElement: any; //Holds reference to the label element created by the renderer
  
  /** Whether or not this is a primary button */
  @HostBinding('class.y-btn-primary') @Input() primary: boolean = false;
  
  get text(): string {
    return this._text;
  }

  /** Sets an icon class based on the label */
  @Input() set text(value: string) {
    if (!this._icon) { this.cssUpdate('icon-', value, this._text); }

    this._text = value;

    if (this.hostRef.nativeElement.tagName === "INPUT") { //Handle input buttons
      this.renderer.setAttribute(this.hostRef.nativeElement, "value", this._text);
    } else {
      if (this._labelElement) this.renderer.removeChild(this.hostRef.nativeElement, this._labelElement); //Remove existing label
      this._labelElement = this.renderer.createText(this._text); //Create and append new one
      this.renderer.appendChild(
        this.hostRef.nativeElement, this._labelElement
      );
    }
  }

  /**
   * Type/style of the button
   */
  get buttonType(): ButtonType {
    return this._buttonType;
  }
  @Input() set buttonType(value: ButtonType) {
    this.cssUpdate('y-btn-', value, this._buttonType); //Remove old. Add new.
    this._buttonType = value;
  }

  /**
   * Icon to use for the button.  Default icon is calculated from label
   */
  get icon(): string {
    return this._icon;
  }
  @Input() set icon(value: string) {
    this.cssUpdate('icon-', value, this._icon);
    this._icon = value;
  }

  protected cssUpdate(prefix: string, newValue: string, oldValue?: string): void {
    setCssClass(this.renderer, this.hostRef.nativeElement, newValue, { replaceCssClass: oldValue, prefix: prefix });
  }

  /**
   * Attach click handler to generate a ripple effect
   * @param event
   */
  @HostListener('click', ['$event']) onClick(event:MouseEvent) {
    const factory:AnimationFactory = this.animationBuilder.build([
      style({
        transform: 'scale(1)',
        opacity: 0.4
      }),
      animate('0.9s', style({
        transform: 'scale(10)',
        opacity: 0
      }))
    ]);

    const pos = this.hostRef.nativeElement.getBoundingClientRect();
    let x = event.clientX - pos.x;
    let y = event.clientY - pos.y;

    const ripple: HTMLElement = this.renderer.createElement("div");
    this.renderer.addClass(this.hostRef.nativeElement, "y-btn-ripple");
    this.renderer.addClass(ripple, "y-ripple");
    this.renderer.appendChild(this.hostRef.nativeElement, ripple);
    const rippleInner: HTMLElement = this.renderer.createElement("div");
    this.renderer.appendChild(ripple, rippleInner);
    this.renderer.setStyle(rippleInner, "left", x + "px");
    this.renderer.setStyle(rippleInner, "top", y + "px");

    const player: AnimationPlayer = factory.create(rippleInner);
    player.onDone(() => {
      this.renderer.removeChild(this.hostRef.nativeElement, ripple); //Remove when done
      this.renderer.removeClass(this.hostRef.nativeElement, "y-btn-ripple");
    });
    player.play();
  }

  constructor(protected hostRef: ElementRef, protected renderer: Renderer2, protected animationBuilder: AnimationBuilder) {
    //Set initial (default) value CSS
    if (!this.icon) this.icon = this.text;
    this.buttonType = this._buttonType; //Set inital button type
  }
  ngOnInit() {
    //let ripple: HTMLElement = this.renderer.createElement("div");
    //this.renderer.addClass(ripple, "y-ripple");
    //this.renderer.appendChild(this.hostRef.nativeElement, ripple);
  }
  ngAfterViewInit() {
    if (this.hostRef.nativeElement.innerText) { //Toggle class based on existance of text content
      this.renderer.addClass(this.hostRef.nativeElement, "y-btn-text");
    } else {
      this.renderer.removeClass(this.hostRef.nativeElement, "y-btn-text");
    }
  }
}
