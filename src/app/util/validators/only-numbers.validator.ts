import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function onlyNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const isValid = /^[0-9]+$/.test(value);
    return isValid ? null : { ONLY_NUMBERS: true };
  };
}
