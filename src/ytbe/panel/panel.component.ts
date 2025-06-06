import {Component, Input, OnInit, ViewEncapsulation, HostBinding, EventEmitter, Output, ContentChild, AfterContentInit, AfterViewInit, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { state, style, transition, animate, trigger, AnimationEvent } from '@angular/animations';
import { TitlebarComponent } from '../titlebar/titlebar.component';

@Component({
  selector: 'ytbe-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  host:{'class':'y-panel'},
  encapsulation: ViewEncapsulation.None,
  animations: [
    /** Define animations for creation and destruction of component
     * Slide in/out from top
     * */
    trigger('contentExpandCollapse', [
      state('in', style({ opacity: 1, 'margin-top': '0px' })), //Default state
      transition('void => expanded', [
        style({ opacity: 0, 'margin-top': '-200px' }),
        animate(200)
      ]),
      transition('expanded => void', [
        animate(200, style({ opacity: 0, 'margin-top': '-200px' })),
      ])
    ])
  ]
})
export class PanelComponent implements OnInit, AfterContentInit {
  //Tracks expanded/collapsed status of panel
  @HostBinding('class.y-collapsed') 
  private _collapsed: boolean = false;

  //Reference to titlebar
  @ViewChild(TitlebarComponent, { static: false }) titlebarView?: TitlebarComponent;
  @ContentChild(TitlebarComponent, { static: true }) titlebarContent?: TitlebarComponent;

  //Reference to native element for titlebar
  @ViewChild(TitlebarComponent, { read: ElementRef, static: false }) titlebarViewEl?: ElementRef;
  @ContentChild(TitlebarComponent, { read: ElementRef, static: true }) titlebarContentEl?: ElementRef;


  /**
   * Title to display
   */
  @Input('panelTitle') title: string = '';

  @HostBinding('class.y-collapsible')
  @Input() collapsible: boolean = false;

  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get collapsed(): boolean { return this._collapsed; }
  @Input() set collapsed(value: boolean) {
    this._collapsed = value;

    //Get titlebar passed as content or built-in titlebar, whichever is applicable
    let titlebarRef: ElementRef | undefined = this.titlebarContentEl || this.titlebarViewEl;
    if (titlebarRef) {
      if (this.collapsible) {
        //Toggle expanded/collapsed classes for titlebar
        this.renderer.removeClass(titlebarRef.nativeElement, value ? 'icon-expanded' : 'icon-collapsed');
        this.renderer.addClass(titlebarRef.nativeElement, value ? 'icon-collapsed' : 'icon-expanded');
      } else {
        this.renderer.removeClass(titlebarRef.nativeElement, 'icon-expanded');
        this.renderer.removeClass(titlebarRef.nativeElement, 'icon-collapsed');
      }
    }
  }

  @HostBinding('class.y-expanded') get expanded():boolean { return !this.collapsed; }
  set expanded(value: boolean) { this.collapsed = !value; }

  /**
   * Gets the animation state to apply to the content
   */
  get contentAnimationState(): string {
    return this.collapsible ? this.expanded ? 'expanded' : '' : '';
  }

  private onTitleClick():void {
    if (this.collapsible) {
      this.collapsed = !this.collapsed;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  constructor(protected renderer: Renderer2) { }

  ngOnInit() {
  }
  ngAfterContentInit(): void {
    //Get titlebar passed as content or built-in titlebar, whichever is applicable
    let titlebar: TitlebarComponent | undefined = this.titlebarContent || this.titlebarView;
    if (titlebar) {
      this.collapsed = this.collapsed; //Initialize
      titlebar.titleClicked.subscribe(x => { this.onTitleClick(); });
    }
  }

}
