import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemsService } from 'src/app/shared/items.service';
import { MainService } from 'src/app/shared/services/main.service';
import { Role } from 'src/app/shared/_models';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { orderTypeEN, orderTypeFR, productStatusEN, productStatusFR, productTypeEN, productTypeFR } from 'src/assets/i18n/options-lists.constant';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss']
})
export class SidebarFilterComponent implements OnInit {
  themeVar = 'orange';
  user: any;
  repSection: any;
  sidebarOpen = true;
  allOrderTypeDisable = false;
  productStatus = productStatusEN;
  orderTypes = orderTypeEN;
  allowedOrderTypes: string[] = [];
  productTypes = productTypeEN;
  territoryList: any = [];
  repsList: any = [];
  selectedRep: any;
  selectedTer: any;
  selectedTerritory: any;
  filterSelection: any = {};
  selectedOrderType = '';
  oneTime = 0;
  isDropdown = true;
  allowedClientOrderTypes : number[] = [];
  allowBranding:boolean = false;
  brands:any = [];
  showAiExpert = false;

  constructor(public mainService: MainService, public userControl: UserControlService, public itemService: ItemsService) {
    // current theme check
    this.mainService.currentTheme.subscribe(res => {
      this.themeVar = res;
    });
    this.mainService.languageChange.subscribe(data => {      
      const allowedOrderTypes = sessionStorage.getItem('allowedOrderTypes');
      if (allowedOrderTypes) {
        this.allowedClientOrderTypes = JSON.parse(allowedOrderTypes).sort((a: any, b: any) => a - b);
      } else {
        // Handle the case where allowedOrderTypes is not present
        this.allowedClientOrderTypes = [1,5]; // or set to a default value if applicable,
      }
      var orderTypeEnglish = {
        "title" : orderTypeEN.title,
        "values" : orderTypeEN.values.filter(x => this.allowedClientOrderTypes.includes(Number(x.orderType))) 
      };

      var orderTypeFrench = {
        "title" : orderTypeFR.title,
        "values" : orderTypeFR.values.filter(x => this.allowedClientOrderTypes.includes(Number(x.orderType)))
      };

      if(!JSON.parse(sessionStorage.getItem('defaultOrderTypes') as any))
      {
        sessionStorage.setItem('defaultOrderTypes', JSON.stringify(
        {
          "orderTypeEN" : orderTypeEnglish,
          "orderTypeFR" : orderTypeFrench
        }));
        this.productStatus = data === 'fr' ? productStatusFR : productStatusEN;
        this.orderTypes = data === 'fr' ? orderTypeFrench : orderTypeEnglish;
        this.productTypes = data === 'fr' ? productTypeFR : productTypeEN;
      }
      else
      {                
        this.productStatus = data === 'fr' ? productStatusFR : productStatusEN;
        this.productTypes = data === 'fr' ? productTypeFR : productTypeEN;
        
        let OrderTypes = JSON.parse(sessionStorage.getItem('defaultOrderTypes') as any);
        if(OrderTypes)        
          this.orderTypes = data === 'fr' ? OrderTypes.orderTypeFR : OrderTypes.orderTypeEN;
        else
          this.orderTypes = data === 'fr' ? orderTypeFrench : orderTypeEnglish;        
      }      
    });
    this.userControl.repSelected = new BehaviorSubject('');
    this.userControl.terSelected = new BehaviorSubject('');
    this.userControl.sidebarFilterControl.subscribe((filter: any) => {
      if(sessionStorage.getItem('orderTypeInCartSession') && (this.allowedClientOrderTypes.indexOf(Number(filter.orderType)) > -1))      
        filter.orderType = sessionStorage.getItem('orderTypeInCartSession');      
      else
        filter.orderType = this.allowedClientOrderTypes.indexOf(Number(filter.orderType)) > -1 ? filter.orderType : this.allowedClientOrderTypes[0].toString();
      
      this.filterSelection = filter;
      this.selectedOrderType = filter.orderType;
      // if(this.filterSelection.orderType === '5'){
      //   this.getListOfReps();
      // }
    });
    this.userControl.repSelected.subscribe(data => {
      if ((data && data !== "") && this.filterSelection.orderType === "5") {
        this.getListOfReps();
      }
    });

    // this.userControl.terSelected.subscribe(data => {
    //   if ((data && data !== "") || this.filterSelection.orderType === "5") {
    //     this.territoryList();
    //   }
    // });

    this.userControl.statusFilterChange.subscribe(filter => {
      this.productStatus.values.forEach(e => {
        if (e.title === filter) {
          e.checked = true;
        }
        else {
          e.checked = false;
        }
      });
    });


    this.userControl.allowedOrderTypes.subscribe((data: { selected: string, allowed: string[] }) => {
      if (data.selected) this.filterSelection.orderType = data.selected;
      this.allowedOrderTypes = data.allowed;
    });

    this.userControl.cartHaveOrderType.subscribe(data => {
      if (data !== '') {
        this.filterSelection.orderType = data.toString();
        this.allOrderTypeDisable = true;
        // this.userControl.sidebarFilterControl.next(this.filterSelection);
      } else {
        this.allOrderTypeDisable = false;
      }
    });
  }

  openChange() {
    // this.isDropdown = !this.isDropdown;
  }

  ngOnInit(): void {

    // console.log('sidebar');

    if (this.filterSelection.orderType === '5') {
      this.getListOfReps();
    }
    let defaultProductStatus: number[] = [];
    const storedDefaultProductStatus = sessionStorage.getItem('defaultProductStatus');
    
    if (storedDefaultProductStatus) {
        defaultProductStatus = JSON.parse(storedDefaultProductStatus).sort((a: any, b: any) => a - b);
    }
    
    if(defaultProductStatus.length > 0) {
      this.productStatus.values.forEach((x) => {
        // Convert x.value to number if necessary
        const value = Number(x.value);
        x.checked = defaultProductStatus.includes(value);
    });
    }
    else {
      this.productStatus.values.forEach(x => x.checked = true);
    }
    this.mainService.getCurrentUser().subscribe(u => {
      this.user = u;
      let rank = u.getHomeRole().rank;
      this.repSection = rank == Role.DistrictManager || rank == Role.RegionalBusinessDirector;
    });  
    
    this.getBrands();
  }

  getBrands():void {
    this.allowBranding = Boolean(sessionStorage.getItem('allowBranding'));
    if(this.allowBranding == true) {
      let territoryId = null;
      let repId = null;
      if (this.selectedOrderType === '5') {        
        repId = this.selectedRep?.id;
        territoryId = this.selectedTerritory?.id;
      } 
     let brandRequest: any = { 
      orderType: this.selectedOrderType ,
      repId:repId,
      territoryId: territoryId
    }
     this.itemService.getBrands(brandRequest).subscribe(res => {
      this.brands = res;
      this.brands = res.map((brand: any) => ({ ...brand, checked: false }));
      // Add 'checked' property to each brand object with initial value 'false'
     });
    }
  }

  ngAfterViewInit(): void {

  }

  changeOrderType(ev: any): any {    
    if (!this.allOrderTypeDisable) {
      sessionStorage.setItem('orderTypeInCartSession', JSON.stringify(ev.target.value));
      this.selectedOrderType = ev.target.value
      this.filterSelection.orderType = ev.target.value;

      // firstRep selecte by default
      // this.selectedRep = this.repsList[0]

      if (this.filterSelection.orderType !== '5') {
        this.filterSelection.repId = '';
        this.filterSelection.territoryId = '';
        // no select rep/ter
        this.selectedRep = '';
        this.selectedTerritory = '';
        this.userControl.repSelected.unsubscribe();
        this.userControl.terSelected.unsubscribe();
        sessionStorage.removeItem('repIdSelected');
        sessionStorage.removeItem('terIdSelected');
        this.getBrands();
      }
      if (this.filterSelection.orderType === '5') {
        this.getListOfReps();
        this.selectedRep = this.repsList[0];
        this.filterSelection.repId = this.selectedRep?.id;
        this.filterSelection.territoryId = this.selectedTerritory?.id;
        this.userControl.repSelected = new BehaviorSubject('');
        this.userControl.repSelected.next(this.selectedRep?.id);
        this.userControl.terSelected = new BehaviorSubject('');
        this.userControl.terSelected.next(this.selectedTerritory?.id);
      }
      // init filter
      this.filterSelection.skip = 0;
      this.filterSelection.page = 1;
      sessionStorage.setItem('orderTypeInCartSession', this.filterSelection.orderType);
      this.userControl.sidebarFilterControl.next(this.filterSelection);
      this.userControl.initFilter.next(true);

    }

  }

  changeProductStatus(ev: any, i: number, checkedT: boolean): any {

    // init filter
    this.filterSelection.skip = 0;
    this.filterSelection.page = 1;
    this.userControl.initFilter.next(true);
    if (ev.target.value === 'all') {
      let items = this.productStatus.values.map(e => {
        return {
          ...e,
          checked: checkedT ? true : false
        }
      });
      this.productStatus.values = items;
      // 
      this.filterSelection.status = null as any;
      this.userControl.sidebarFilterControl.next(this.filterSelection);
    } else {
      // 
      this.productStatus.values[0].checked = false;
      let items = this.productStatus.values.filter((value, index) => {
        return value.checked;
      }).map(e => e.value);
      this.filterSelection.status = items as any;
      this.userControl.sidebarFilterControl.next(this.filterSelection);
    }
  }

  selectRep(repDetails: any) {
    // this.filterSelection.orderType = '1';
    this.selectedRep = repDetails;
    this.filterSelection.repId = repDetails.id;

    this.userControl.sidebarFilterControl.next(this.filterSelection);
    // init filter
    this.filterSelection.skip = 0;
    this.filterSelection.page = 1;
    this.userControl.initFilter.next(true);
    sessionStorage.setItem('repIdSelected', this.filterSelection.repId)
    //this.getListOfTerritory(this.filterSelection.repId);
  }

  selectTerritory(terDetails: any) {
    
    this.selectedTerritory = terDetails;
    this.filterSelection.territoryId = terDetails.id;
    this.getBrands();

    this.userControl.sidebarFilterControl.next(this.filterSelection);
    sessionStorage.setItem('terIdSelected', this.filterSelection.territoryId)
    // init filter
    this.filterSelection.skip = 0;
    this.filterSelection.page = 1;
    this.userControl.initFilter.next(true);
  }

  getListOfReps() {
    // http://localhost:44371/QPHMA/users/reps

    this.itemService.getReps().subscribe((res: any) => {
      this.repsList = res;

      //Restore selected rep or select first rep in list
      const repId = this.filterSelection.repId || this.repsList[0].id;
      this.selectedRep = this.repsList.filter((r: any) => r.id === repId)[0];

      if (this.filterSelection.orderType === '5') {
        this.filterSelection.repId = this.selectedRep.id;
      }
      sessionStorage.setItem('repIdSelected', this.filterSelection.repId);
      this.getListOfTerritory();
    });
  }


  getListOfTerritory() {
    this.itemService.getTerritories().subscribe(res => {
      this.territoryList = res;

      //Restore selected territory or select first territory in list
      const terId = this.filterSelection.territoryId || this.territoryList[0].id;
      this.selectedTerritory = this.territoryList.filter((r: any) => r.id === terId)[0];

      if (this.filterSelection.orderType === '5') {

        if (terId) {
          this.filterSelection.territoryId = terId;
        } else {
          this.filterSelection.territoryId = this.selectedTerritory.id;
        }        
      this.getBrands();
      }
      sessionStorage.setItem('terIdSelected', this.filterSelection.territoryId);
      this.userControl.sidebarFilterControl.next(this.filterSelection);
      
    });
  }

  changeProductType(): any {
    // init filter
    this.filterSelection.skip = 0;
    this.filterSelection.page = 1;
    this.userControl.initFilter.next(true);
    let itemTypes = this.productTypes.values.filter((value: any, index) => {
      return value.checked;
    }).map(e => e.title);
    this.filterSelection.itemtype = itemTypes as any;
    this.userControl.sidebarFilterControl.next(this.filterSelection);
  }

  changeIsNew(ev: any): any {
    this.userControl.sidebarFilterControl.next(this.filterSelection);
  }

  changeIsDownloadable(ev: any) {
    this.userControl.sidebarFilterControl.next(this.filterSelection);
  }

  getOrderTypeTitle(orderType : any): any {
    return this.orderTypes.values.find(x=>x.orderType == orderType)?.title;
  }

  changeBrandType(): any {
    // Init filter
  this.filterSelection.skip = 0;
  this.filterSelection.page = 1;
  this.userControl.initFilter.next(true);

  // Get selected brand IDs
  const selectedBrandIds = this.brands.filter((e: { checked: boolean }) => e.checked).map((e: { brandId: any }) => e.brandId);



  // Update filter selection with selected brand IDs
  this.filterSelection.brandType = selectedBrandIds;
  
  // Notify subscribers about filter change
  this.userControl.sidebarFilterControl.next(this.filterSelection);
  }

  onAiExpertClick() {
    this.showAiExpert = !this.showAiExpert;
    this.userControl.showAiExpert.next(this.showAiExpert);
  }

}


@Pipe({
  name: 'noShowStatus'
})
export class NoShowPipe implements PipeTransform {
  transform(value: any[], format?: boolean): any {

    let val = value.filter((value, index) => {
      return value.show;
    })
    return val;
  }
}