import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, Input } from '@angular/core';
import { MediaBreakpoint, setMediaBreakpoint, Layout, setLayout } from '../../css/operators';

@Component({
  selector: 'ytbe-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: [],
  host: {
    'class': 'y-form-section'
  },
  encapsulation: ViewEncapsulation.None
})
export class FormSectionComponent implements OnInit {
  private _layout: Layout = Layout.horizontal;
  private _breakpoint: MediaBreakpoint = MediaBreakpoint.small;

  /**
   * Layout to use. Default is horizontal
   */
  get layout(): Layout {
    return this._layout;
  }
  @Input() set layout(value: Layout) {
    setLayout(this.renderer, this.hostRef.nativeElement, value, this._layout);
    this._layout = value;
  }

  /**
   * Media Breakpoint to use. Default is small
   */
  get breakpoint(): MediaBreakpoint {
    return this._breakpoint;
  }
  @Input() set breakpoint(value: MediaBreakpoint) {
    setMediaBreakpoint(this.renderer, this.hostRef.nativeElement, value, this._breakpoint);
    this._breakpoint = value;
  }

  constructor(protected hostRef: ElementRef, protected renderer: Renderer2) {
  }

  ngOnInit() {
    this.layout = this.layout || Layout.horizontal;
    this.breakpoint = this.breakpoint || MediaBreakpoint.small;
  }
}
