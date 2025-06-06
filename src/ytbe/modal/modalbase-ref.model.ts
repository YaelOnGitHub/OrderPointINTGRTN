import { Injectable, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { ModalTools } from './modal-tools.enum';
import { ControlStatus } from '../models/control-status.enum';
import { tap } from 'rxjs/operators';
import { ModalBaseService } from './modalbase.service';
import { ModalBaseConfig } from './modalbase-config.model';

/**
 *Modal reference used to manage the state and events of a modal.
 * */
export abstract class ModalBaseRef<TContent, TComponent, TService extends ModalBaseService<any, any>> {
  /** Observable result for dialog */
  result: Subject<string> = new Subject<string>();

  /** ID of the menu */
  id: string = '';

  /* Title of the side menu - String */
  title: string = '';

  /** Event raised when the modal is closed */
  closed: Subject<any> = new Subject<any>();

  /** Event raised when attempting to modal menu */
  closing: Subject<any> = new Subject<any>();

  /** Whether or not the menu is currently dirty (unsaved changes) */
  isDirty: boolean = false;

  /* Tools to display in the title bar */
  tools?: ModalTools[];

  /* Whether or not the cotent of the dialog should be flush with the menu's bounding box */
  isFlushAligned?: boolean = false;

  /**
   * Gets the availability of the specified modal tool
   * @param tool Tool to check
   */
  getToolStatus(tool: ModalTools): ControlStatus {
    return this.tools && this.tools.indexOf(tool) >= 0 ?
      this.isDirty ? ControlStatus.disabled : ControlStatus.enabled :
      ControlStatus.hidden;
  }

  /** Get availability of close button */
  get closeStatus(): ControlStatus {
    return this.getToolStatus(ModalTools.close);
  }

  /**
   * Attempts to close this Modal
   * */
  close(e: any = null, force: boolean = false): Observable<boolean> {
    return this.service.close(this, force);
  }

  /** Modal component instance */
  componentRef?: ComponentRef<TComponent>;

  /** Content instance (for components) */
  contentInstance?: TContent;

  /** Content Component Ref (for components or template) */
  contentComponentRef?: ComponentRef<TContent> | EmbeddedViewRef<TContent>;

  constructor(protected service: TService) { }
}
