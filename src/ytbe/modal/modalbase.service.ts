import { Observable } from 'rxjs';
import { ModalBaseConfig } from './modalbase-config.model';
import { ModalBaseRef } from './modalbase-ref.model';

export abstract class ModalBaseService<TConfig extends ModalBaseConfig<any>, TRef extends ModalBaseRef<any, any, any>> {  
  constructor() { }

  /**
   * Open a Modal
   * @param config Configuration of the modal to add
   */
  abstract open<TContent>(config: any): Observable<TRef>;

  /**
   * Close a Modal
   * @param modalRef Modal instance to close
   */
  abstract close(modalRef: TRef, force: boolean): Observable<boolean> ;
}
