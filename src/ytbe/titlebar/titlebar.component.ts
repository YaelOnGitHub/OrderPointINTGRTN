import { Component, OnInit, Input, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { setCssClass } from '../css/operators';

/**
 * Title bar component - Used by App Titlebar, Panels, etc.
 * */
@Component({
  selector: 'ytbe-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: [],
  host: {
    'class': 'y-titlebar'
  },
  encapsulation: ViewEncapsulation.None
})
export class TitlebarComponent implements OnInit {
  @Input() title: string = '';
  @Input() titlebarType: string = '';
  @Output() titleClicked: EventEmitter<void> = new EventEmitter<void>();


  private _icon: string = '';

  /**
   * Icon to use for the button.  Default icon is calculated from label
   */
  get icon(): string {
    return this._icon ? "icon-" + this._icon : "";
  }
  @Input() set icon(value: string) {
    this._icon = value;
  }

  constructor(protected hostRef: ElementRef, protected renderer: Renderer2) {
  }
  ngOnInit() {
    setCssClass(this.renderer, this.hostRef.nativeElement, this.titlebarType, { prefix: 'y-titlebar-' });
  }

  public onClick(e:any)
  {
    this.titleClicked.emit();
  }
}
