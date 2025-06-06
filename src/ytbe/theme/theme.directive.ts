import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { setCssClass } from '../css/set-css-class';
import { ThemeService } from './theme.service';

@Directive({
  selector: '[ytbeTheme]'
})
export class ThemeDirective implements OnInit, OnDestroy {
  private _theme:string = '';
  private _themeSubscription : Subscription | undefined;

  get theme():string {
    return this._theme;
  }

  @Input('ytbeTheme') set theme (value: string){
    this.cssUpdate(value, this._theme); //Update CSS Class
    this._theme = value;
  }

  protected cssUpdate(newValue: string, oldValue?: string): void {
    setCssClass(this.renderer, this.hostRef.nativeElement, newValue, { 
      prefix: "y-theme-",
      replaceCssClass: oldValue, 
      transform:false 
    });
  }
  
  constructor(protected hostRef: ElementRef, protected renderer: Renderer2, protected themeService: ThemeService) {
  }
  ngOnInit(){
    this._themeSubscription = this.themeService.theme.subscribe((x:string) => {
      this.theme = x;
    });
  }
  ngOnDestroy() {
    //Dispose of subscriptions
    this._themeSubscription!.unsubscribe();
  }
}
