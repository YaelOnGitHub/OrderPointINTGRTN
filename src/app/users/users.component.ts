import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { MainService } from '../shared/services/main.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  loadPage = false;
  constructor(public themeService: ThemeService,public mainService: MainService) { }

  ngOnInit(): void {
    this.getCurrentTheme()
    // console.log('users_sections');
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
