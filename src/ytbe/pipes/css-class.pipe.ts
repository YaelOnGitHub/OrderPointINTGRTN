import { Pipe, PipeTransform } from '@angular/core';
import { transformCssClass } from '../css/transform-css-class';

@Pipe({
  name: 'ytbeCssClass'
})
export class CssClassPipe implements PipeTransform {
  transform(value: string): string {
    return transformCssClass.apply(this, [value]);
  }
}
