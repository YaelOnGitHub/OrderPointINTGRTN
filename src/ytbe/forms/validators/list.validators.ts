import { FormArray } from '@angular/forms';

export class ListValidators {
  /**
   * Ensures a list of controls has at least 1 control with a value.
   * @param arr Array of controls to check
   */
  static atLeastOneRequiredValidator(arr: FormArray): {[s: string]: any}{
    const vals = arr.getRawValue();
    for (let i = 0; i < vals.length; i++) {
      if (vals[i]) return {};
    }
    return {
      'atLeastOneRequired': { message: '{0} must contain at least one value' } }; //None found
  }
}
