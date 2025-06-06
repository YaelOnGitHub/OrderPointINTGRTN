import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateStringPipe } from './date-string.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DateStringPipe],
  exports:[DateStringPipe]
})
export class DateStringModule { }
