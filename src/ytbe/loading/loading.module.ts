import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { LoadingCustomDirective } from './loading-custom.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingComponent, LoadingCustomDirective],
  exports: [LoadingComponent, LoadingCustomDirective]
})
export class LoadingModule { }
