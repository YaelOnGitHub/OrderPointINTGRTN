import {Directive, Input, HostBinding} from '@angular/core'
@Directive({
    selector: 'img[srcDefault]',
    host: {
      '(load)': 'loaded()',
      '(error)':'setDefault()',
      '[src]':'src'
     }
  })
  
 export class ImageErrorDirective {
    @Input() src:string = '';
    @Input() srcDefault:string = '';
    @HostBinding('class') className:string = '';
  
    setDefault() {
      this.src = this.srcDefault;
    }
    loaded(){
      this.className = 'y-image-loaded';
    }
  }