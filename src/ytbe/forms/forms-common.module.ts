import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSectionModule } from './form-section/form-section.module';
import { FormFieldModule } from './form-field/form-field.module';
import { FormDirectiveModule } from './directives/form-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormSectionModule,
    FormFieldModule
  ],
  declarations: [],
  exports: [FormSectionModule, FormFieldModule, FormDirectiveModule]
})
export class FormsCommonModule { }
