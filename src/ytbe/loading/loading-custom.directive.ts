import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ytbeLoadingCustom]'
})
export class LoadingCustomDirective {

  constructor(public template: TemplateRef<any>) { }

}
