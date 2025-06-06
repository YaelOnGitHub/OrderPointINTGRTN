import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CssClassPipe } from './css-class.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CssClassPipe],
  exports:[CssClassPipe]
})
export class CssClassModule { }
