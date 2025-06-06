import { Component, OnInit, ViewEncapsulation, Output, Input, ContentChild, ViewChild, Renderer2, ElementRef, Optional } from '@angular/core';
import { state, style, transition, animate, trigger, query, AnimationEvent } from '@angular/animations';
import { TitlebarComponent } from '../titlebar/titlebar.component';
import { ModalRef } from './modal-ref.model';
import { ModalAction } from './modal-action.model';
import { Subject } from 'rxjs';
import { ButtonType } from '../button/button-type.eum';

@Component({
  selector: 'ytbe-modal',
  templateUrl: './modal.component.html',
  styleUrls: [],
  host: {
    '[@enterLeave]': '{value:animation,params:{speed:animationSpeed}}', '(@enterLeave.done)': 'animationDone($event)', //Attach event handler
    'class': 'y-modal'
  },
  encapsulation: ViewEncapsulation.None,
  animations: [
    /** Define animations for creation and destruction of overlay
     * */
    trigger('enterLeave', [
      transition('void => fade', [
        query(".y-modal-container",
          [
            style({ opacity: 0 })
          ]
        ),
        query("ytbe-overlay",
          [
            style({ opacity: 0 }),
            animate('{{speed}}', style({ opacity: '*' }))
          ]
        ),
        query(".y-modal-container",
          [
            animate('{{speed}}', style({ opacity: '*' }))
          ]
        )
      ], { params: { speed: '.20s' } }),
      transition('fade => void', [
        query(".y-modal-container",
          [
            animate('{{speed}}', style({ opacity: 0}))
          ]
        ),
        query("ytbe-overlay",
          [
            animate('{{speed}}', style({ opacity: 0 }))
          ]
        )
      ], { params: { speed: '.20s' } }),
      transition('void => zoom', [
        query(".y-modal-container",
          [
            style({ opacity: 0, transform: "scale(0.5)" })
          ]
        ),
        query("ytbe-overlay",
          [
            style({ opacity: 0 }),
            animate('{{speed}}', style({ opacity: '*' }))
          ]
        ),
        query(".y-modal-container",
          [
            animate('{{speed}}', style({ opacity: '*', transform: "scale(1)" }))
          ]
        )
      ], { params: { speed: '.20s' } }),
      transition('zoom => void', [
        query(".y-modal-container",
          [
            animate('{{speed}}', style({ opacity: 0, transform: "scale(0.5)" }))
          ]
        ),
        query("ytbe-overlay",
          [
            animate('{{speed}}', style({ opacity: 0 }))
          ]
        )
      ], { params: { speed: '.20s' } })
  ])
  ]
})
export class ModalComponent implements OnInit {
  @Input() animation: string = "zoom";
  @Input() animationSpeed: string = "0.20s";
  @Input() actions: ModalAction[] = [];
  @Input() height?: Number = undefined;
  @Input() width?: Number = undefined;
  @Input() minWidth?: Number = undefined;

  /** Action result observable */
  @Output() result: Subject<string> = new Subject<string>();

  constructor(protected renderer: Renderer2, @Optional() public modalRef?: ModalRef<any>) { }

  //Get reference to titlebar
  @ViewChild(TitlebarComponent, { static: false }) titlebarView?: TitlebarComponent = undefined;
  @ContentChild(TitlebarComponent, { static: true }) titlebarContent?: TitlebarComponent = undefined;
  
  /**
   * Title to display
   */
  @Input('modalTitle') title: string = '';

  /**
   * Exposes enum button type to template
   */
  buttonType = ButtonType;

  ngOnInit() {
    //If actions were set as part of the config, use them.
    if (this.modalRef) this.actions = this.modalRef.actions!;
  }

  actionClick(action: ModalAction): void {
    //Indicate that action was taken
    this.result.next(action.name!);
    if (this.modalRef) {
      this.modalRef.result.next(action.name!);
      if (action.closes) this.modalRef.close(); 
    }
  }
  protected animationDone(event: AnimationEvent) {
  }
}
