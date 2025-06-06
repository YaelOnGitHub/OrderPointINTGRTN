import { BaseClass } from "../models/base-class.model";
import { TemplateRef } from "@angular/core";
import { ComponentType } from "../models/component-type.interface";
import { ModalBaseConfig } from './modalbase-config.model';
import { ModalAction } from './modal-action.model';

/**
 * Configuration for Modal Dialogs - Used to create
 * components and enable/disable features.
 * */
export class ModalConfig<T> extends ModalBaseConfig<T> {
  /* Actions for the modal */
  actions?: ModalAction[];

  constructor(init: Partial<ModalConfig<T>>) {
    super(init);
  }
}
