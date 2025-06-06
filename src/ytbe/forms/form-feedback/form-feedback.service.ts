import { Injectable, Inject } from '@angular/core';
import { AbstractControl, FormControlName } from '@angular/forms';

/**
 * Form Feedback Service used to obtain validation messages
 * */
@Injectable()
export class FormFeedbackService {
  /** Provider name for Messages */
  static PROVIDER_MESSAGES: string = "formFeedbackMessages";

  /**
   * Performs string replacement from error object values
   * @param message Message for which to perform string replacement where {propertyName} strings exist for properties defined on the error object
   * @param error Error object from which to obtain values
   */
  protected replaceMessageVars(message: string, error: { [key: string]: any }) {
    Object.keys(error).forEach(key => {
      message = message.replace('{' + key + '}', error[key]);
    });
    return message;
  }

  /**
   * Gets the current error message for the specified formControl
   * @param formControl Control from which to obtain errors
   * @param fieldName Field name to display
   * @param message Optional message (will override default messages)
   */
  getMessage(formControl: AbstractControl, fieldName: string, message?: string, messages?:{[key:string]:string}) {
    const fieldNameVar: string = '{fieldName}'; //Define fieldName var for string replacement
    fieldName = fieldName || 'Value'; //Default field name if none defined
    if (message) return message.replace(fieldNameVar, fieldName)
    if (!formControl || !formControl.errors) return ''; //No errors, so return

    //Get all errors
    const errors: { [key: string]: any } = formControl.errors;

    let error: string = '';    
    //Handle built-in errors
    if (errors['required']) {
      error = messages && messages['required'] ? messages['required'] : this.messages['required'] ? this.messages['required'] : fieldNameVar + ' is required';
    } else if (errors['minlength']) {
      error = this.replaceMessageVars(messages && messages['minLength'] ? messages['minLength'] : this.messages['minlength'] ? this.messages['minlength'] : fieldNameVar + ' must have min length of {requiredLength}', errors['minlength']);
    } else if (errors['maxlength']) {
      error = this.replaceMessageVars(messages && messages['maxLength'] ? messages['maxLength'] : this.messages['maxlength'] ? this.messages['maxlength'] : fieldNameVar + ' must have max length of {requiredLength}', errors['maxlength']);
    } else if (errors['email']) {
      error = messages && messages['email'] ? messages['email'] : this.messages['email'] ? this.messages['email'] : fieldNameVar + ' must be a valid email';
    } else if (errors['requiredtrue']) {
      error =messages && messages['requiredtrue'] ? messages['requiredtrue'] : this.messages['requiredtrue'] ? this.messages['requiredtrue'] : fieldNameVar + ' must be true';
    } else if (errors['min']) {
      error = this.replaceMessageVars(messages && messages['min'] ? messages['min'] : this.messages['min'] ? this.messages['min'] : fieldNameVar + ' must be greater than {min}', errors['min']);
    } else if (errors['max']) {
      error = this.replaceMessageVars(messages && messages['max'] ? messages['max'] : this.messages['max'] ? this.messages['max'] : fieldNameVar + ' must be less than {max}', errors['max']);
    } else {
      //Handle any custom errors by building an array of errors.
      const errorsCustom: any[] = Object.keys(errors).map(key => { return { name: key, value: errors[key] }; });

      //Get first error and display it
      if (errorsCustom.length > 0) {
        //If validator returns a message, use it.  Otherwise display the provider message (if available) or the name/type of the validator as the error message.

        if (errorsCustom[0].value && errorsCustom[0].value.message) {
          error = errorsCustom[0].value.message;
        } else {
          error = (messages ? messages[errorsCustom[0].name] : null) || this.messages[errorsCustom[0].name] || errorsCustom[0].value || errorsCustom[0].name;
        }
      }
    }

    return error.toString().replace(fieldNameVar, fieldName);
  }

  constructor(@Inject(FormFeedbackService.PROVIDER_MESSAGES) protected messages: { [key: string]: string } = {}) {
  }
}
