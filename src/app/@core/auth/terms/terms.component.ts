import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { TranslateService } from '@ngx-translate/core';
import { MainService } from 'src/app/shared/services/main.service';
import { Role } from 'src/app/shared/_models';
import { BehaviorSubject } from 'rxjs';
import { TiUser } from 'src/titanium/ti-user.model';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  protected returnUsersUrl: string = '/users';
  protected returnHomeOfficeUrl: string = '/homeoffice';
  protected currLanguage: string = 'en';

  logoImageUrl: string = '';
  clientName:string = '';
  termsBlock: any;

  enabledTeamPage : boolean = false;
  enabledTeamAsLandingPage: boolean = false;

  constructor(
    private spinner: NgxSpinnerService, 
    public mainService: MainService, 
    public translate: TranslateService,
    public router: Router, 
    public themeService: ThemeService) 
    {
  }


  ngOnInit(): void {    
    //Apply current user's theme to terms screen
    this.getCurrentTheme();
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.currLanguage = this.translate.currentLang;
      if (!currUser) {
        this.router.navigate([this.currLanguage+'/auth/login']);
        return;
      }
      let clientId = currUser.homeClientId;  
      this.logoImageUrl = currUser.getHomeClient().logoImageUrl;  
      this.clientName = currUser.getHomeClient().name; 
      if (clientId){
        this.getSettings(clientId, currUser);
      } else {
        this.router.navigate([this.currLanguage+'/auth/login']);
      }
    });
  }

  accept(): void {
    this.spinner.show();
    sessionStorage.setItem('termsAccepted', 'true'); //Store user's acceptance
   this.mainService.getCurrentUser().subscribe(currUser => {
      this.spinner.hide();
      switch (currUser.getHomeRole().rank) {
        case Role.Admin:
        case Role.HomeOffice:
        case Role.ITAdmin:
          this.router.navigateByUrl(this.currLanguage+this.returnHomeOfficeUrl);
          break;
        default:
          this.checkClient(currUser);
          //this.router.navigateByUrl(this.currLanguage+this.returnUsersUrl);
          break;
      }
    });
  }

  
  checkClient(currUser: TiUser) {
    // For Axsom client and Manager Role make My team page default landing page
    const role = currUser.getHomeRole().rank;
    if(this.enabledTeamPage && this.enabledTeamAsLandingPage && role == Role.DistrictManager) {
      this.router.navigateByUrl(this.currLanguage+'/users/my-team');
    } else {
      this.router.navigateByUrl(this.currLanguage+this.returnUsersUrl);
    }
  }

  acceptDefault(currUser:any): void {
    
    this.spinner.show();
    sessionStorage.setItem('termsAccepted', 'true'); //Store user's acceptance
   // this.mainService.getCurrentUser().subscribe(currUser => {
      this.spinner.hide();
      switch (currUser.getHomeRole().rank) {
        case Role.Admin:
        case Role.HomeOffice:
        case Role.ITAdmin:
          this.router.navigateByUrl(this.currLanguage+this.returnHomeOfficeUrl);
          break;
        default:
          this.checkClient(currUser);
          // this.router.navigateByUrl(this.currLanguage+this.returnUsersUrl);
          break;
      }
    //});
    
  }

  getAdditionalnformation(clientId: string): void {
    this.mainService.getAdditionalnformation(clientId).subscribe({
      next: (res) => {  
        console.log(res);      
        if(res && res.territoryId)        
          sessionStorage.setItem('territoryId', JSON.stringify(res.territoryId));

        if(res && res.ruleDeductDTPEnabled)
          sessionStorage.setItem('ruleDeductDTPEnabled', JSON.stringify(res.ruleDeductDTPEnabled));
      },
      error: (err) => {
      }
    });
  }

  getSettings(clientId: string, currUser:any): void {
    this.spinner.show();
    this.getAdditionalnformation(clientId);
    this.mainService.getSettings(clientId).subscribe({
      next: (res) => {        
        if(res && res.allowedOrderTypes)        
          sessionStorage.setItem('allowedOrderTypes', JSON.stringify(res.allowedOrderTypes));

        if(res && res.defaultProductStatus)
          sessionStorage.setItem('defaultProductStatus', JSON.stringify(res.defaultProductStatus));

        if(res && res.allowBranding)
          sessionStorage.setItem('allowBranding', JSON.stringify(res.allowBranding));

        if(res && res.allowedTransfer)
          sessionStorage.setItem('allowedTransfer', JSON.stringify(res.allowedTransfer));
          
        if(res && res.enabledUsageLabelOnDashboard)
        sessionStorage.setItem('enabledUsageLabelOnDashboard', JSON.stringify(res.enabledUsageLabelOnDashboard));

        if(res && res.enableDisplayPediodLabel)
          sessionStorage.setItem('enableDisplayPediodLabel', JSON.stringify(res.enableDisplayPediodLabel));

        if(res && res.enabledMyTeamAsLandingPage) {
          sessionStorage.setItem('enabledMyTeamAsLandingPage', JSON.stringify(res.enabledMyTeamAsLandingPage));
          this.enabledTeamAsLandingPage = res.enabledMyTeamAsLandingPage
        }

        if(res && res.enabledMyTeamPage) {
          sessionStorage.setItem('enabledMyTeamPage', JSON.stringify(res.enabledMyTeamPage));
          this.enabledTeamPage = res.enabledMyTeamPage
        } 

        if (res && res.splashPage && res.splashPage.bodyHtml && res.splashPage.enabled)
          this.termsBlock = res.splashPage.bodyHtml; 
        else 
          this.acceptDefault(currUser);

        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();   
        if (err.status == 401){ //If not authorized to fetch settings, bypass terms - fix for OPT-188 GSK logo and terms Conditions dialog is appearing for non GSK USER
          this.acceptDefault(currUser);
        }
      }
    });
  }

  logout(): any {
    this.mainService.logOut();
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
