import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OverlayComponent],
  exports: [OverlayComponent],
  entryComponents: [OverlayComponent]
})
export class OverlayModule { }
