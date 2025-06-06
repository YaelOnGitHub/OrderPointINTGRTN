import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogOutComponent implements OnInit {
  
  constructor(
    public mainService: MainService, 
    public themeService: ThemeService) 
    {
  }

  ngOnInit(): void {
    //this.themeService.switchTheme(this.mainService.currentThemeValue);
  }
}
