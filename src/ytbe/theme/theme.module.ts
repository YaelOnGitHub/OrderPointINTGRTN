import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from './theme.directive';
import { ThemeService } from './theme.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ThemeDirective
  ],
  exports:[
    ThemeDirective
  ],  
  providers: [
    ThemeService
  ]
})
export class ThemeModule {
  constructor() {}
}
export * from './theme.service';
