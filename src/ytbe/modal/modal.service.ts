import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, ComponentFactory, Renderer2, ComponentRef, TemplateRef, EmbeddedViewRef, Inject, RendererFactory2 } from '@angular/core';
import { ModalBaseService } from './modalbase.service';
import { ModalComponent } from './modal.component';
import { ModalConfig } from './modal-config.model';
import { ModalRef } from './modal-ref.model';
import { ComponentType } from '../models/component-type.interface';
import { Observable, Subject, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ModalContainerService } from './modal-container.service';
import { ModalContainerComponent } from './modal-container.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService extends ModalBaseService<ModalConfig<any>, ModalRef<any>> {
  protected renderer: Renderer2;

  open<TContent>(config: Partial<ModalConfig<TContent>>): Observable<ModalRef<TContent>> {
    const result: Subject<ModalRef<TContent>> = new Subject<ModalRef<TContent>>();

    config = new ModalConfig<TContent>(config);

    //Create the side menu component
    const factory: ComponentFactory<ModalComponent> = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    //Create a container for modals if one does not already exist
    if (!this.containerService.vc) {
      const containerFactory: ComponentFactory<ModalContainerComponent> = this.componentFactoryResolver.resolveComponentFactory(ModalContainerComponent);
      const container: ComponentRef<ModalContainerComponent> = containerFactory.create(this.parentInjector);
      const containerDomElem = (container.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
      this.appRef.attachView(container.hostView); //Add to the component tree
      document.body.appendChild(containerDomElem);
    }

    //Await creation of container and then proceed with creation of content
    this.containerService.ready.subscribe(() => {
      //Get the injector for the container, which will serve as the base injector for our new components
      const parentInjector: Injector = this.containerService.vc.parentInjector;

      //Define modal ref
      const modalRef: ModalRef<TContent> = new ModalRef<TContent>(this);
      modalRef.id = config.id!;
      modalRef.title = config.title!;
      modalRef.tools = config.tools;
      modalRef.actions = config.actions;
      modalRef.isFlushAligned = config.isFlushAligned!;

      const injector = Injector.create({providers:[
        { provide: ModalRef, useValue: modalRef }, //Make modal ref available to component
        { provide: ModalConfig, useValue: config } //Make config available to components
      ], parent: parentInjector});

      //Create the content compontent
      let contentRef: any = null;
      if (typeof (config.content) === "string") { //Handle simple string
        contentRef = this.containerService.renderer.createText(config.content);
      } else if (config.content instanceof TemplateRef) { //Handle template
        const templateRef: TemplateRef<any> = (config.content as TemplateRef<any>);
        modalRef.contentComponentRef = templateRef.createEmbeddedView(config.content);
        contentRef = modalRef.contentComponentRef.rootNodes[0];
      } else { //Handle component
        const contentFactory: ComponentFactory<TContent> = this.componentFactoryResolver.resolveComponentFactory(config.content as ComponentType<TContent>);
        const contentComponent: ComponentRef<TContent> = contentFactory.create(injector);
        modalRef.contentComponentRef = contentComponent;
        modalRef.contentInstance = contentComponent.instance;
        contentRef = contentComponent.location.nativeElement;
      }

      const componentRef: ComponentRef<ModalComponent> =
        this.containerService.vc.createComponent(factory, 0, injector,
          [
            [], //First child is custom title bar implementation
            [contentRef] //Pass the content component to the modal's second ng-content
          ]
        );
      componentRef.instance.title = config.title!; //Set title from config
      componentRef.changeDetectorRef.detectChanges(); //Force change detection

      //Set reference to the menu itself
      modalRef.componentRef = componentRef;

      setTimeout(() => {
        result.next(modalRef);
      }, 1);
    });  

    /** Return new menu */
    return result;
  }
  close(modalRef: ModalRef<any>, force: boolean = false): Observable<boolean> {
    modalRef.closing.next(undefined); //Raise event to indicate attempted close
    if (!modalRef.isDirty || force) {
      modalRef.componentRef!.destroy(); //Close if not dirty
      modalRef.closed.next(undefined);
    }
    return of(true);
  }
  closeAll() {
    //Remove until empty;
    while (this.containerService.vc.length) {
      this.containerService.vc.remove();
    }
  }
  constructor(
    protected appRef: ApplicationRef,
    @Inject(DOCUMENT) protected document: Document,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected rendererFactory2: RendererFactory2,
    protected parentInjector: Injector,
    protected containerService: ModalContainerService
  ) {
    super();
    this.renderer = this.rendererFactory2.createRenderer(null, null);
  }

}
