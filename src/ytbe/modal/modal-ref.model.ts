import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { ModalBaseRef } from './modalbase-ref.model';
import { ModalAction } from './modal-action.model';

/**
 *Modal reference used to manage the state and events of a modal.
 * */
export class ModalRef<TContent> extends ModalBaseRef<TContent, ModalComponent, ModalService> {
  /* Actions for the modal */
  actions?: ModalAction[];

  constructor(protected override service: ModalService) {
    super(service);
  }
}
