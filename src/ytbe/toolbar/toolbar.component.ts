import { Component, OnInit, ViewEncapsulation, Input, ElementRef, Renderer2 } from '@angular/core';
import { setCssClass } from '../css/operators';
import { ToolbarAlign } from './toolbar-align.enum';
import { ToolbarType } from './toolbar-type.enum';
import { ToolbarPosition } from './toolbar-position.enum';

/**
 * Tools container (toolbar)
 * */
@Component({
  selector: 'ytbe-toolbar',
  template: '<ng-content></ng-content>',
  styleUrls: [],
  host: {
    'class': 'y-toolbar'
  },
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {


  /** Toolbar Type */
  private _toolbarType: ToolbarType = ToolbarType.primary;

  /** Horizontal Alignment */
  private _align: ToolbarAlign = ToolbarAlign.left;

  /** Toolbar Position */
  private _position: ToolbarPosition = ToolbarPosition.top;


  /** Layout - Horizontal/Vertical */
  get toolbarType(): ToolbarType {
    return this._toolbarType;
  }
  @Input() set toolbarType(value: ToolbarType) {
    this.cssUpdate(value, this._toolbarType); //Remove old. Add new.
    this._toolbarType = value;
  }

  /** Horizontal Alignment */
  get align(): ToolbarAlign {
    return this._align;
  }
  @Input() set align(value: ToolbarAlign) {
    this.cssUpdate(value, this._align); //Remove old. Add new.
    this._align = value;
  }

  /** Position - Bottom/Top */
  get position(): ToolbarPosition {
    return this._position;
  }
  @Input() set position(value: ToolbarPosition) {
    this.cssUpdate(value, this._position); //Remove old. Add new.
    this._position = value;
  }

  /**
   * Updates the CSS class
   * @param newValue New value
   * @param oldValue Old value
   */
  protected cssUpdate(newValue: string, oldValue?: string): void {
    setCssClass(this.renderer, this.hostRef.nativeElement, newValue, { replaceCssClass: oldValue, prefix: 'y-toolbar-' });
  }

  constructor(protected hostRef: ElementRef, protected renderer: Renderer2) {
    this.toolbarType = this._toolbarType;
    this.position = this._position;
    this.align = this._align;
  }

  ngOnInit() {
  }

}
