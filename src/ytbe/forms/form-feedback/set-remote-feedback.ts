import { FormGroup } from '@angular/forms';

export function setRemoteFeedback(
  form: FormGroup,
  error: any
) {
  //Handle error for the form itself
  if (error.error && error.error.message) {
    form.setErrors({
      remote: error.error.message || "An unknown error occurred, please try your again later."
    });
  }

  //Otherwise look for model validation error which returns dictionary in the form of an array of errors indexed by field name.
  for (let e in error.error) {
    if (form.controls.hasOwnProperty(e)) {
      form.controls[e].setErrors({ remote: { message: error.error[e].join(" ") } });
      form.controls[e].markAsTouched(); //Force touched to force validation message to appear
    }
  }

}
