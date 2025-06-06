import { Component, OnInit, Input, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormControlName, FormGroup } from '@angular/forms';
import { setCssClass } from '../../css/operators';
import { FormFeedbackService } from './form-feedback.service';

/**
 * Component used to display form feedback - Validation errors, etc.
 * Accepts message or fieldName and formControl inputs.
 * @Example [fieldName]="name" [formControl]="formControl"
 * */
@Component({
  selector: 'ytbe-form-feedback',
  templateUrl: './form-feedback.component.html',
  styleUrls: [],
  host: {
    'class': 'y-form-feedback'
  },
  encapsulation: ViewEncapsulation.None
})
export class FormFeedbackComponent implements OnInit {
  @Input() feedbackType: string = '';

  private _message: string = '';
  private _messages: {[key:string]:string} = {};

  get message(): string {
    return this.feedbackService.getMessage(this.formControl! || this.formGroup, this.fieldName!, this._message, this._messages);    
  }
  @Input() set message(value:string) {
    this._message = value;
  }
  @Input() set messages(value:{[key:string]:string}) {
    this._messages = value;
  }

  @Input() formControl?: AbstractControl;
  @Input() formGroup?: FormGroup;

  @Input() fieldName: string = '';

  constructor(protected hostRef: ElementRef, protected renderer: Renderer2, protected feedbackService: FormFeedbackService) {}

  ngOnInit() {
    setCssClass(this.renderer, this.hostRef.nativeElement, this.feedbackType, { prefix: 'y-form-feedback-' });
  }

}
