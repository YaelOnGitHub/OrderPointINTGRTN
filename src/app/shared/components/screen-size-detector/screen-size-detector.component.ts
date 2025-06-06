import { AfterViewInit, Component, ElementRef, HostListener } from "@angular/core";
import { SCREEN_SIZE } from "src/ytbe/css/screen-size.enum";
import { ResizeService } from "../../services/screen.resize.service";

@Component({
    selector: 'screen-size-detector',
    templateUrl: './screen-size-detector.component.html',
})

export class ScreenSizeDetectorComponent implements AfterViewInit {
    constructor(private elementRef: ElementRef, private resizeSvc: ResizeService) { }

    prefix = 'is-';
    currentSize : any = [];
    sizes = [
      {
        id: SCREEN_SIZE.XS, name: 'xs', css: `d-block d-sm-none`
      },
      {
        id: SCREEN_SIZE.SM, name: 'sm', css: `d-none d-sm-block d-md-none`
      },
      {
        id: SCREEN_SIZE.MD, name: 'md', css: `d-none d-md-block d-lg-none`
      },
      {
        id: SCREEN_SIZE.LG, name: 'lg', css: `d-none d-lg-block d-xl-none`
      },
      {
        id: SCREEN_SIZE.XL, name: 'xl', css: `d-none d-xl-block`
      },
    ];
  
    @HostListener("window:resize", [])
    onResize(){    
      this.detectScreenSize("resize");    
    }
    
    ngAfterViewInit() {      
      this.detectScreenSize();
    }
  
    private detectScreenSize(eventType?: any) {        
      this.currentSize = this.sizes.find(x => {
        // get the HTML element
        const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);          
        // check its display property value
        const isVisible = window.getComputedStyle(el,null).display != 'none';
  
        return isVisible;
      });
      
      if(eventType == "resize")
        this.resizeSvc.onResize(this.currentSize.id);
      else
        this.resizeSvc.onLoad(this.currentSize.id);
    }
}