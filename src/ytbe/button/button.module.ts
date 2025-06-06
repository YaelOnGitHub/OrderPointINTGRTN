import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button.directive';
import { ToggleButtonDirective } from './toggle-button.directive';

@NgModule({
  declarations: [ButtonDirective, ToggleButtonDirective],
  exports: [ButtonDirective, ToggleButtonDirective],
  imports: [CommonModule]
})
export class ButtonModule {
  constructor() {}
 }

export * from './button-type.eum';
