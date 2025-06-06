import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ItemsService } from 'src/app/shared/items.service';
import { MainService } from 'src/app/shared/services/main.service';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';
import { Role } from 'src/app/shared/_models';
import { orderTypeEN, orderTypeFR, productStatusOnOrderHistoryFilterEN, productStatusOnOrderHistoryFilterFR } from 'src/assets/i18n/options-lists.constant';

@Component({
  selector: 'app-filter-order-details',
  templateUrl: './filter-order-details.component.html',
  styleUrls: ['./filter-order-details.component.scss']
})
export class FilterOrderDetailsComponent implements OnInit {
  orderTypes: any;
  productStatus: any;
  mod: any = {};
  selected = null;
  selectedType: any;
  selectedTypeID: any;
  selectedStatus: any;
  selectStatusValues: any = '';
  filterData: any;
  statusValues: any;
  filterFormModel!: FormGroup;
  repsList: any = [];
  selectedRep: any;

  repSection:boolean = false;

  constructor(public fb: FormBuilder,
    public modal: NgbActiveModal,
    private itemService: ItemsService,
    private orderHistoryService: OrderHistoryService,
    private mainService: MainService
  ) { }

  ngOnInit(): void {
    this.filterFormModel = this.fb.group({
      month: [''],
      search: [''],
      dateEnd: [''],
      dateStart: [''],
      type: [''],
      repId: [''],
      status: [''],
      selectDate: ['']
    });


    this.filterFormModel.patchValue(this.filterData);
    if (this.filterData.selectDate.startDate === null || this.filterData.selectDate.endDate === null) {
      this.filterFormModel.patchValue({ selectDate: '' });
    }
    this.mainService.languageChange.subscribe(data => {
      this.productStatus = data === 'fr' ? productStatusOnOrderHistoryFilterFR.values : productStatusOnOrderHistoryFilterEN.values;
      this.orderTypes = data === 'fr' ? orderTypeFR : orderTypeEN;
    });
    
    this.gettypes();
    this.getstatuses(); 
    this.mainService.getCurrentUser().subscribe(u => {
      let rank = u.getHomeRole().rank;
      this.repSection = rank == Role.DistrictManager || rank == Role.RegionalBusinessDirector;
      //Restrict order types to exclude "For a Rep" for all users but Managers
      this.orderTypes.values = this.orderTypes.values.filter((el:any) => el.onFilterValue != 5 || this.repSection);
    });
  }
  gettypes() {
    this.orderHistoryService.getTypes().subscribe((res: any) => {
      // this.orderTypes = res;
      const typeId = sessionStorage.getItem('oh-typeSelected');
      if (typeId != null && typeId !== 'undefined') {
        const filtereType = this.orderTypes.values.filter((el: any) => el.onFilterValue === parseInt(typeId));
        this.filterFormModel.patchValue({ type: filtereType[0].onFilterValue });
        this.selectedType = filtereType[0].title;
        this.selectedTypeID = filtereType[0].onFilterValue;

        if (typeId == '5') {
          this.getListOfReps();
        }
      }
    });
  }

  changeDate(ev: any): void {
    if (ev && ev.startDate != null && ev.endDate != null) {

      let startDate:Date = ev.startDate.toDate();
      let endDate:Date = ev.endDate.toDate();

      //Fix for OPT-192 NaN appearing on Calendar days when user select Future Date.
      if (startDate > endDate) {
        endDate = startDate;
        this.filterData.selectDate.endDate._d = endDate;
      }

      let body = {
        dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
        dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
      };

      this.filterFormModel?.patchValue({
        month: '',
        dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
        dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
      });
      // this.getAllOrders(this.filterForm?.value);
    }
  }


  getstatuses() {

    this.productStatus = this.productStatus.map((item: any) => { return { ...item, selected: false } });

    const selectLocalStatus = JSON.parse(sessionStorage.getItem('oh-statusSelected') as any);

    if (selectLocalStatus != null && selectLocalStatus !== 'undefined' && selectLocalStatus !== '') {
      this.productStatus = this.productStatus.map((el: any) => {
        return {
          ...el,
          selected: selectLocalStatus.indexOf(el.value) === -1 ? false : true
        }
      });
      this.statusValues = this.productStatus.filter((el: any) => el.selected);
      this.filterFormModel.patchValue({ status: this.productStatus.filter((el: any) => el.selected) });
      this.selectedStatus = this.filterFormModel.value.status.map((e: any) => e.title);
      this.selectStatusValues = this.statusValues.length === 0 ? '' : this.filterFormModel.value.status.map((e: any) => e.value);
    }
  }
  selectOrderType(oType: any) {
    this.filterFormModel.patchValue({ type: oType.onFilterValue });
    this.selectedType = oType.title;
    this.selectedTypeID = oType.onFilterValue;
    if (this.selectedTypeID == 5) {
      this.getListOfReps();
    }
  }

  selectRep(repDetails: any) {
    this.selectedRep = repDetails;

    this.filterFormModel.patchValue({ repId: this.selectedRep.id });
    sessionStorage.setItem('oh-repIdSelected', this.selectedRep.id)
  }

  getListOfReps() {
    // http://localhost:44371/QPHMA/users/reps

    this.itemService.getReps().subscribe((res: any) => {

      this.repsList = res;
      //Restore selected rep or select first rep in list
      const selectLocalRep = JSON.parse(sessionStorage.getItem('oh-repIdSelected') as any);
      const repId = selectLocalRep.toString() || this.repsList[0].id;
      this.selectedRep = this.repsList.filter((r: any) => r.id === repId)[0];
      this.filterFormModel.patchValue({ repId: this.selectedRep.id });

      sessionStorage.setItem('oh-repIdSelected', this.selectedRep.id)
    });
  }

  /**
   * Adds additional statuses to the filter
   */
  insert() {
    this.statusValues = this.productStatus.filter((el: any) => el.selected);
    this.filterFormModel.patchValue({ status: this.productStatus.filter((el: any) => el.selected) });
    this.selectedStatus = this.filterFormModel.value.status.map((e: any) => e.title);
    this.selectStatusValues = this.statusValues.length === 0 ? '' : this.filterFormModel.value.status.map((e: any) => e.value);
  }

  get f() {
    return this.filterFormModel.controls;
  }

  /**
   * Handles change of date radio selectino
   * @param ev Event details
   */
  changeRadio(ev: any) {
    let month = ev.target.defaultValue;
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(month));
    let endDate = new Date();
    
    if (parseInt(month) > 0) {
      this.filterFormModel?.patchValue({
        month: month,
        dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
        dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
        selectDate: ''
      });
    } else {
      this.filterFormModel?.patchValue({
        month: month,
        dateStart: '',
        dateEnd: '',
        selectDate: ''
      });
    }
  }


  apply() {
    sessionStorage.setItem('oh-typeSelected', this.selectedTypeID);
    sessionStorage.setItem('oh-repIdSelected', JSON.stringify(this.selectedRep?.id));
    sessionStorage.setItem('oh-statusSelected', JSON.stringify(this.selectStatusValues));

    const repIdValue = this.selectedRep == null ? '' : this.selectedRep.id;
    this.filterFormModel.patchValue({ status: this.selectStatusValues, repId: repIdValue });
    this.modal.close(this.filterFormModel.value);
  }
  clearValue() {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let endDate = new Date();

    this.remove();
    this.filterFormModel.patchValue({
      month: '3',
      search: '',
      dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
      dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
      type: '',
      status: [],
      selectDate: ''
    });
    this.modal.close(this.filterFormModel.value);
  }
  onCloseModal() {
    this.modal.dismiss();
  }

  remove(): void {
    const typeId = sessionStorage.getItem('oh-typeSelected');
    if (typeId != null) {
      sessionStorage.removeItem('oh-typeSelected');
    }
    const statusId = sessionStorage.getItem('oh-statusSelected');
    if (statusId != null) {
      sessionStorage.removeItem('oh-statusSelected');
    }
  }
}
