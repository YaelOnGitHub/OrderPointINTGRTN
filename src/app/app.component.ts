import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from './shared/services/admin.service';
import { MainService } from './shared/services/main.service';
import { UserControlService } from './users/service/user-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ti-frontend';
  previousUrl = '';
  theme: any;
  filterSelection = {
    orderType: '',
    take: 8, skip: 0, page: 1,
    // repId: null,
    // territoryId: "",
    // status: '',
    status: [],
    search: "",
    isNew: false,
    isDownloadable: false,

    itemtype: [],

    repId: '', territoryId: ''
  }
  constructor(private userControl: UserControlService, public as: AdminService, public mainService: MainService, public translate: TranslateService, @Inject(DOCUMENT) private document: any, private router: Router, private renderer: Renderer2) {
    translate.addLangs(['en', 'fr']);
    router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.mainService.getCurrentUser().subscribe(currUser => {
            if (this.previousUrl) {
              this.renderer.removeClass(document.body, this.previousUrl);
            }
            if (currUser) {
              this.mainService.getThemeType.next({
                themeType: currUser.themeType
              });
              this.theme = currUser.themeType;
            } else {
              this.theme = 2;
            }
            let currentUrlSlug = event.url.slice(1);

            if (currentUrlSlug) {
              this.renderer.addClass(document.body, currentUrlSlug.replace(/[\/ ]/g, '-'));
            }
            this.previousUrl = currentUrlSlug.replace(/[\/ ]/g, '-');
            if (currentUrlSlug.indexOf('fr') === 0) {
              translate.setDefaultLang('fr');
              translate.use('fr');
              this.mainService.languageChange.next('fr');
            } else {
              translate.setDefaultLang('en');
              translate.use('en');
              this.mainService.languageChange.next('en');
            }
            // if ((currentUrlSlug === 'en/homeoffice' || currentUrlSlug === 'fr/homeoffice') && currUser?.impersonator !== '') {
            //   this.stopImpersonate();
            // }
            window.scroll(0, 0);
            this.userControl.sidebarFilterControl = new BehaviorSubject(this.filterSelection)
          });
        }
      });
  }

  stopImpersonate(): void {
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.as.impersonateStop(currUser?.impersonator).subscribe(data => {
        // console.log(data);
        localStorage.setItem('identity', JSON.stringify(data));
        this.as.impersonateUserActive.next(false);
        this.router.navigateByUrl(this.translate.currentLang + '/homeoffice');
      });
    });
  }

  ngOnInit() {
    // console.log(this.translate);
  }

  setLang(lang: string): void {
    this.mainService.setLanguage(lang);
  }

  @HostListener("window:load", ["$event"])
  public onWindowScroll(): void {
    if (window.location.pathname === 'en/auth/login') {
      this.document.body.classList.add('en-auth-login');
    }
  }
}
