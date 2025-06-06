import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { AdminService } from '../shared/services/admin.service';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  impersonating: boolean = false;
  loadPage = false;
  impersonatingUser: any;
  constructor(public adminService: AdminService, private router: Router, private renderer: Renderer2, public themeService: ThemeService, public mainService: MainService) {
    this.renderer.removeClass(document.body, 'en-auth-login');
    router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let currentUrlSlug = event.url.slice(4);
          if (currentUrlSlug.indexOf('impersonating') > 0) {
            this.impersonating = true;
            this.adminService.impersonateUserActive.next(true);
          } else {
            this.impersonating = false;
            this.adminService.impersonateUserActive.next(false);
          }
        }
      });
  }

  ngOnInit(): void {
    // console.log('AdminComponent');

    this.getCurrentTheme()
  }

  getCurrentTheme(): any {
    this.mainService.getThemeType.subscribe(data => {
      if (data.themeType === 0) {
        this.mainService.currentTheme.next('dark');
        this.themeService.switchTheme('dark');
      }
      if (data.themeType === 1) {
        this.mainService.currentTheme.next('light');
        this.themeService.switchTheme('light');
      }
      if (data.themeType === 2) {
        this.mainService.currentTheme.next('dark');
        this.themeService.switchTheme('dark');
      }
    });
    this.loadPage = true;
  }
}
