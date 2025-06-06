import { Renderer2 } from '@angular/core';
import { BaseClass } from '../models/base-class.model';
import { transformCssClass } from './transform-css-class';

/**
 * Options for setting CSS class
 */
export class SetCssClassOptions extends BaseClass {
  /**
   * Prefix to use
   */   
  prefix?: string = '';
  /**
   * Optional CSS Class Name to replace
   */
  replaceCssClass?: string;
  /**
   * Whether or not CSS Class Names should be transformed
   */
  transform?: boolean = true;
  
  constructor(init?: Partial<SetCssClassOptions>){ 
    super();
    this.init(init);
  }
}

/**
 * Sets the CSS Class Name for a specified element.
 * Allows for an optional prefix, class name to replace, and whether or not to transform
 * @param renderer Renderer to use
 * @param nativeElement Element to which CSS Class Name should be applied
 * @param cssClass CSS Class Name name to set
 * @param options Options
 */
export function setCssClass(
    renderer: Renderer2,
    nativeElement: any,
    cssClass: string, 
    options: Partial<SetCssClassOptions> = new SetCssClassOptions()
) {
  options = new SetCssClassOptions(options);
  if (options.replaceCssClass){
    const val = options.transform ? transformCssClass(options.replaceCssClass) : options.replaceCssClass;
    renderer.removeClass(nativeElement, options.prefix + val);
  }
  if (cssClass){
    const val = options.transform ? transformCssClass(cssClass) : cssClass;
    renderer.addClass(nativeElement, options.prefix + val);
  }
}
