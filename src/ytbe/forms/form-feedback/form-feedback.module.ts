import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFeedbackComponent } from './form-feedback.component';
import { FormFeedbackService } from '../../forms/form-feedback/form-feedback.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormFeedbackComponent],
  exports: [FormFeedbackComponent]
})
export class FormFeedbackModule {
  /**
   * Register the validation messages for the application
   * @param messages Custom validation messages to use.  Messages defined in appModule will override child modules.
   */
  static forRoot(messages?: { [key: string]: string }): ModuleWithProviders<FormFeedbackModule> {
    return {
      ngModule: FormFeedbackModule,
      providers: [
        {
          provide: FormFeedbackService,
          useClass: FormFeedbackService,
          multi: false
        },
        { provide: FormFeedbackService.PROVIDER_MESSAGES, useValue: messages } //Create provider for menu items for consumption by NavigationService
      ]
    };
  }
}
