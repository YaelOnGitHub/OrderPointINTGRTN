import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field.component';
import { FormFieldInputDirective } from './form-field-input.directive';
import { FormFeedbackModule } from '../form-feedback/form-feedback.module';

@NgModule({
  imports: [
    CommonModule,
    FormFeedbackModule.forRoot()
  ],
  declarations: [FormFieldComponent, FormFieldInputDirective],
  exports: [FormFeedbackModule, FormFieldComponent, FormFieldInputDirective]
})
export class FormFieldModule { }
