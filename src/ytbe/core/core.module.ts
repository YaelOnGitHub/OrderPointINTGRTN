import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageErrorDirective } from './image-error.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations:[ImageErrorDirective],
  exports:[ImageErrorDirective]
})
export class CoreModule { }