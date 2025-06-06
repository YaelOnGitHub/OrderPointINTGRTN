import { Renderer2 } from '@angular/core';
import { BaseClass } from '../models/base-class.model';
import { setCssClass } from './set-css-class';
import { MediaBreakpoint } from './media-breakpoint.enum';

export function setMediaBreakpoint (
    renderer: Renderer2,
  nativeElement: any,
  breakpoint: MediaBreakpoint,
  oldBreakpoint: MediaBreakpoint
) {
  setCssClass(renderer, nativeElement, breakpoint, { replaceCssClass: oldBreakpoint, prefix: 'y-mb-' })
}
