import { Component, OnInit, Renderer2 } from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { TranslateService } from '@ngx-translate/core';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private themeService: ThemeService,public mainService: MainService, public translate: TranslateService, private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'en-auth-login');
  }

  ngOnInit(): void {
    this.themeService.switchTheme('dark');
    // console.log('Auth_Init');
    this.renderer.addClass(document.body, 'en-auth-login');
  }
  setLang(lang: string): void {
    this.mainService.setLanguage(lang);
  }
}
