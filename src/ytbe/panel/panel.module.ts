import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { TitlebarModule } from '../titlebar/titlebar.module';
import { PanelbarComponent } from './panelbar.component';
import { ToolbarModule } from '../toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    TitlebarModule,
    ToolbarModule
  ],
  declarations: [PanelComponent, PanelbarComponent],
  exports: [PanelComponent, PanelbarComponent, TitlebarModule, ToolbarModule]
})
export class PanelModule { }
export * from './panel.component';
export * from './panelbar.component';
export * from './panelbar-type.enum';
