import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { OverlayModule } from '../overlay/overlay.module';
import { TitlebarModule } from '../titlebar/titlebar.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { ButtonModule } from '../button/button.module';
import { ModalActionsComponent } from './modal-actions.component';
import { ModalTitlebarComponent } from './modal-titlebar.component';
import { ModalContainerComponent } from './modal-container.component';

//Services -
//  Modal - Shared service for all modal stuff
//    - Track current max z - index
//    - Open at specific index
//    - Open at next available
//    - Close specific modal

//Controls:
//- Modal - Container component houses overlay and content
//  - Overlay
//  - Content should be dynamically injected
//    - Options: Content animation preset - Ex: Fade -in, fly -in, None / Custom, etc.
//		- Events: OverlayAnimationDone - Fired when overlay animation completes

//SideMenu now becomes a single modal with individual menus within - When opened, it will in turn call
//    Modal service open by passing sidemenu container as the content and then creating the first menu.

//Dialog sits on top of Modal and provides means to supply basic content(text and action buttons)

//Overlay service no longer needed

@NgModule({
  imports: [
    CommonModule,
    TitlebarModule,
    ButtonModule,
    ToolbarModule,
    OverlayModule
  ],
  declarations: [ModalComponent, ModalActionsComponent, ModalTitlebarComponent, ModalContainerComponent],
  exports: [ModalComponent, ModalActionsComponent, ModalTitlebarComponent],
  entryComponents: [ModalComponent, ModalContainerComponent]
})
export class ModalModule { }
