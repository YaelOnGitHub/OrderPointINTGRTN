import { BaseClass } from "../models/base-class.model";
import { TemplateRef } from "@angular/core";
import { ComponentType } from "../models/component-type.interface";
import { ModalTools } from './modal-tools.enum';


/**
 * Base Configuration for Modal Dialogs - Used to create
 * components and enable/disable features.
 * */
export abstract class ModalBaseConfig<TContent> extends BaseClass {
  /* Unique ID used by the service to determine which menu is currently active */
  id: string = '';

  /* Title of the Modal - String */
  title: string = '';

  /* Content for the side menu - String, template, or component */
  content: string | TemplateRef<TContent> | ComponentType<TContent>  = '';

  /* Tools to display in the title bar */
  tools?: ModalTools[] = [ModalTools.close];

  /* Whether or not the content of the modal should be flush with the modal's bounding box */
  isFlushAligned?: boolean = false;

  constructor(init: Partial<ModalBaseConfig<TContent>>) {
    super();    
    this.init(init);
  }
}
