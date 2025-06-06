import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Helps reformat dates passed by ASP.Net as serialized JSON 
 */
@Pipe({
  name: 'ytbeDateString'
})
export class DateStringPipe implements PipeTransform extends DatePipe {
  transform(value: string, format: string): string {
    let date:Date = value ? new Date(value.replace("T", " ")) : null;
    return super.transform.call(this, date, format);
  }
}
