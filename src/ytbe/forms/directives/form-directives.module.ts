import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericOnlyDirective } from './numeric-only.directive';
import { RegExpMatchOnlyDirective } from './regexp-match-only.directive';
import { UpperCaseDirective } from './uppercase';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NumericOnlyDirective, RegExpMatchOnlyDirective, UpperCaseDirective],
  exports: [NumericOnlyDirective, RegExpMatchOnlyDirective, UpperCaseDirective]
})
export class FormDirectiveModule { }
