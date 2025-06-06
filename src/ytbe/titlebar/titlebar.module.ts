import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitlebarComponent } from './titlebar.component';
import { ToolbarModule } from '../toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule
  ],
  declarations: [TitlebarComponent],
  exports: [TitlebarComponent]
})
export class TitlebarModule { }
