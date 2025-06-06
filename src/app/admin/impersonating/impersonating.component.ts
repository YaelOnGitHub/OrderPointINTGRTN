import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/app/shared/items.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-impersonating',
  templateUrl: './impersonating.component.html',
  styleUrls: ['./impersonating.component.scss']
})
export class ImpersonatingComponent implements OnInit {

  drop = false;
  p: any;
  pageRequest = {
    "take": 8, "skip": 0, "page": 1
  }

  page = 1;
  itemsPerPage = 6;
  totalItems: any;

  selectedStatus: string = '[All]';
  selectedTitle: string = '';
  products: any[] = [];
  formatedCount: number | undefined;
  constructor(private spinner: NgxSpinnerService, public router: Router, public themeService: ThemeService, public adminService: AdminService, private itemService: ItemsService, private mainService: MainService) {
    this.formatedCount = this.products.length;

  }


  ngOnInit(): void {
    // console.log('Home_section');
    this.mainService.getCurrentUser().subscribe(currUser => {
      if (currUser?.impersonator !== '') {
        this.adminService.impersonateUserActive.next(true);
        let clientId = currUser.homeClientId; 
        this.getAdditionalnformation(clientId);
      } else {
        this.router.navigate(['../']);
      }
    });
  }

  getAdditionalnformation(clientId: string): void {
    this.mainService.getAdditionalnformation(clientId).subscribe({
      next: (res) => {     
        if(res && res.territoryId)        
          sessionStorage.setItem('territoryId', JSON.stringify(res.territoryId));

        if(res && res.ruleDeductDTPEnabled)
          sessionStorage.setItem('ruleDeductDTPEnabled', JSON.stringify(res.ruleDeductDTPEnabled));
      },
      error: (err) => {
      }
    });
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
  }

}
