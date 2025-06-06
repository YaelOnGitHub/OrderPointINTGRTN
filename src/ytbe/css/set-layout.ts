import { Renderer2 } from '@angular/core';
import { BaseClass } from '../models/base-class.model';
import { setCssClass } from './set-css-class';
import { Layout } from './layout.enum';

export function setLayout (
    renderer: Renderer2,
    nativeElement: any,
    orientation: Layout,
    oldOrientation: Layout
) {
  setCssClass(renderer, nativeElement, orientation, { replaceCssClass: oldOrientation, prefix: 'y-layout-' })
}
