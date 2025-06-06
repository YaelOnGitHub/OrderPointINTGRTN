import { Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation, Renderer2, ContentChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { FormFieldInputDirective } from './form-field-input.directive';
import { FormControlDirective, FormControlName, RequiredValidator } from '@angular/forms';
import { transformCssClass } from '../../css/operators';

/**
 * Wraps an input or text area and provides additionally functionality including:
 * - Custom look & feel
 * - Validation
 * - Label (with required field indicator)
 * - Placeholder
 * @Example:
 * <ytbe-form-field name="My Field Display Name">
 *    <input type="text" formControlName="myField" required />
 * </ytbe-form-field>
 * */
@Component({
  selector: 'ytbe-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: [],
  host: {
    'class': 'y-form-field'
  },
  encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent implements OnInit, AfterContentInit, AfterViewInit {
  private static _id: number = 0;

  private _placeholder: string = '';
  private _icon: string = '';

  /**
   * Display name for the field.  Used as default label and placeholder and displayed for validation messages.
   */
  @Input() name: string = '';

  /**
   * Label text for the field (when useLabel = true)
   */
  @Input() label: string = '';

  /* Input text to display. */
  @Input() feedback: string = '';

  /* Messages to display. */
  @Input() messages: {[key:string]:string} = {};

  /**
   * Gets the placeholder text
   */
  get placeholder(): string {
    return this._placeholder;
  }
  /**
   * Sets the placeholder text
   */
  @Input() set placeholder(value: string) {
    this._placeholder = value;
    this.updatePlaceholder();
  }

  /**
  * Gets the icon to display
  */
  get icon(): string {
    return this._icon;
  }
  /**
   * Sets the icon to display
   */
  @Input() set icon(value: string) {
    this._icon = value;

    if (this.inputRef) {
      //If an icon has been provided, update input element class
      if (this._icon) {
        this.renderer.addClass(this.inputRef.elementRef.nativeElement, "y-with-icon");
      } else {
        this.renderer.removeClass(this.inputRef.elementRef.nativeElement, "y-with-icon");
      }
    }
  }

  /**
   * Whether or not to display the label.  Default = true
   */
  @Input() useLabel: boolean = true;
  
  /**
   * Reference to label
   */
  @ViewChild('labelRef', { static: false }) labelRef?: ElementRef;

  /**
   * Reference to input control or textbox
   */
  @ContentChild(FormFieldInputDirective, { static: true }) inputRef?: FormFieldInputDirective;
  
  /**
   * Whether or not the form field is required
   */
  @Input() required: boolean = false;

  /**
   * Unique ID of the form field
   */
  id: string = '';

  constructor(protected renderer: Renderer2) {
    FormFieldComponent._id++; //Generate new unique ID for control

    if (!this.name) { //If name is not defined, fall back on label or placeholder
      this.name = this.label || this.placeholder;
    }
  }

  /**
   * Updates the placeholder text for the input or textbox
   * */
  updatePlaceholder(): void {
    if (this.inputRef) {
      //Set placeholder on input element
      const placeholder: string = this.placeholder || this.label || this.name;
      this.renderer.setAttribute(this.inputRef.elementRef.nativeElement, "placeholder", placeholder);
    }
  }
  ngOnInit() {
    //Create ID for this control instance and append name
    this.id = 'field' + FormFieldComponent._id + (this.name ? '_' + transformCssClass(this.name) : '');
  }
  ngAfterContentInit() {
    if (this.inputRef) {
      this.required = this.inputRef.elementRef.nativeElement.required;
      this.updatePlaceholder(); //Update the placeholder
      // console.log('test', this.inputRef);
    }
  }
  ngAfterViewInit() {
    // console.log('ngAfterViewInit');
    if (this.inputRef) {
      //Use name on original input element (if it exists) or unique name if it doesn't
      let fieldName: string = this.inputRef.elementRef.nativeElement.name;
      if (!fieldName) {
        fieldName = this.id;
        this.renderer.setAttribute(this.inputRef.elementRef.nativeElement, "name", fieldName);
      }

      //If label is used, update the for attribute
      if (this.labelRef) this.renderer.setAttribute(this.labelRef.nativeElement, "for", fieldName);
    }
  }
}
