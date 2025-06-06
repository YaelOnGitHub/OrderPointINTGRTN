import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ConfirmationTransferComponent } from 'src/app/common/modal/confirmation-transfer/confirmation-transfer.component';
import { TransferRepComponent } from 'src/app/common/modal/transfer-rep/transfer-rep.component';
import { TransferRequest } from 'src/app/shared/_models/transferRequest';
import { MainService } from 'src/app/shared/services/main.service';
import { TeamService } from 'src/app/shared/services/team.service';
import { TransferService } from 'src/app/shared/transfer.service';

interface TeamMember {
  id: number
  Rep_FirstName: string
  Rep_LastName: string
  handle: string
  ProductId: string
  quantityAllocated: number
  usedForHandCarry: number
  usedForDTP: number
  totalUsage: number
  usageClass: string
  remainingAllocation: number
  quantityOnHand: number
  hasAlert?: boolean,
  DtpUsage: number,
  OnHandQty: number,
  OpUsage: number,
  TerritoryId: string,
  TotalLimit: number,
  RemainingBalance: number,
  RepRosterId: string
}

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit {

  territoryId = "81968-045-31"
  managerName = "";
  totalAllocated = 0
  totalHandCarry = 0
  totalDTP = 0
  totalUsage = 0
  remainingAllocation = 0
  totalOnHand = 0
  dtpRuleEnabled: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  private destroy$ = new Subject<void>();

  teamMembers: TeamMember[] = []
  filteredMembers: TeamMember[] = []
  private searchSubject = new Subject<string>();
  @Input() productInfo: any;
  @Output() dataProcessed = new EventEmitter<any>();

  constructor(public modelService: NgbModal, private _teamService: TeamService, private mainService: MainService, public translate: TranslateService,

    private transferService: TransferService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      const search = searchText.toLowerCase();
      this.filteredMembers = this.teamMembers.filter(member =>
        Object.values(member).some(val =>
          String(val).toLowerCase().includes(search)
        )
      );
    });

    
    this.dtpRuleEnabled = Boolean(sessionStorage.getItem('ruleDeductDTPEnabled')) || false;
    this.territoryId =  JSON.parse(sessionStorage.getItem('territoryId') || ""); 

    this.mainService.getCurrentUser().subscribe(currUser => {
      this.managerName = currUser.firstName +" "+ currUser.lastName || '';
    });

    this._teamService.selectedProduct$
      .pipe(takeUntil(this.destroy$))
      .subscribe(product => {
        if (product) {
          this.productInfo = product;
          this.loadTeamMembers(product);
        }
      });
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  transferAllocation(member: any, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(TransferRepComponent, { windowClass: 'my-team', centered: true, keyboard, backdrop });
    modal.componentInstance.productDetails = this.productInfo;
    modal.componentInstance.allMembers = this.filteredMembers;
    console.log(this.productInfo)
    console.log(member)
    modal.componentInstance.member = member;
    modal.result.then((userResponse: any) => {
      if (userResponse) {
        const transferProductRequest = []
        transferProductRequest.push({
          productId: userResponse?.toRep.ProductId,
          transferUnit: userResponse.quantity
        });
        let req: TransferRequest =
        {
          repTo: userResponse?.toRep.RepId ?? '',
          repFrom: userResponse?.fromRep.RepId ?? '',
          transferType: 2,
          products: transferProductRequest,
          fromTerritoryId:  userResponse?.fromRep.TerritoryId,
          toTerritoryId : userResponse?.toRep.TerritoryId
        };

        this.transferService.submitTransfer(req).subscribe(res => {
          if (res !== "") {

            this.spinner.hide();

            const genericModalRef = this.modelService.open(ConfirmationTransferComponent, { windowClass: 'filter-view', centered: true, keyboard: false, backdrop: 'static' });
            genericModalRef.componentInstance.onlyOK = true;
            // Display sucess message to user (e.g., using toast or modal)
            this.translate.get("transferPage.apiMessageCode.SUCCESS_TRANSFER").subscribe(msg => {
              genericModalRef.componentInstance.title = msg;
              genericModalRef.componentInstance.showSucessIcon = true;
              this.spinner.hide();
              this.loadTeamMembers(this.productInfo);
            });
          }
        },
            
        (error: any) => {
          let errorCodeTranslated = 'SERVER_ERROR_GENERIC';
          let productErrors: any[] = [];
      
          if (error && error.error && error.error.Message) {
            try {
              const errorResponse = JSON.parse(error.error.Message);
              if (errorResponse) {
                const errorCode = errorResponse.apiMessageCode;
                if (errorCode) {
                  errorCodeTranslated = errorCode;
                  // Extract product errors if available
                  productErrors = errorResponse.productWiseError || [];
                }
              }
            } catch (parseError) {
              // Handle parsing error
            }
          }
      
          this.displayGenericErrorMessageNew(errorCodeTranslated, productErrors);
        });

      }
    });

  }

  displayGenericErrorMessageNew(errorCode: string, productErrors: any[]) {
    const genericModalRef = this.modelService.open(ConfirmationTransferComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
    genericModalRef.componentInstance.onlyOK = true;
    const errorMessageKey = `transferPage.apiMessageCode.${errorCode}`;

    let errorMessage = '';
      // Generate error message for each product error
      // productErrors.forEach(error => {
      //   if (error.productId) {
      //     errorMessage += `<br/> <b>Product: ${error.productId}</b>`;
      //   }
      //   if (error.apiMessageCode) {
      //     const productMessageKey = `transferPage.apiMessageCode.${error.apiMessageCode}`;
      //       this.translate.get(productMessageKey).subscribe(msg => {
      //         errorMessage += ` - ${msg}<br/>`;
      //       });
      //   }
      // });

      // Display error message to user (e.g., using toast or modal)
    this.translate.get(errorMessageKey).subscribe(msg => {
      genericModalRef.componentInstance.title = msg;
      genericModalRef.componentInstance.details = errorMessage;
      this.spinner.hide();
    });
  }
  clearValues() {
    this.totalAllocated = 0;
    this.totalHandCarry = 0,
    this.totalDTP = 0;
    this.totalOnHand = 0;
    this.remainingAllocation = 0;
    this.totalUsage = 0;
  }

  processTotalValues(teamMembers: any) {
    teamMembers.forEach((member: { TotalLimit: any; OpUsage: any; DtpUsage: any; RemainingBalance: any; OnHandQty: any; }) => {
      this.totalAllocated += member.TotalLimit;
      this.totalHandCarry += member.OpUsage;
      this.totalDTP += member.DtpUsage;
      this.totalOnHand += member.OnHandQty;
      this.remainingAllocation += member.RemainingBalance
    });

    this.totalUsage = this.totalHandCarry + this.totalDTP;

    return {
      totalAllocated: this.totalAllocated,
      totalHandCarry: this.totalHandCarry,
      totalDTP: this.totalDTP,
      totalUsage: this.totalUsage,
      totalOnHand: this.totalOnHand,
      remainingAllocation: this.remainingAllocation
    };
  }

  loadTeamMembers(product: any) {

    this.spinner.show();
    const params = {
      productId: product.id,
      startDate: product.periodStartDate,
      endDate: product.periodEndDate,
      ruleDeductDTPEnabled: this.dtpRuleEnabled
    }

    this._teamService.fetchProductUsage(params).subscribe(res => {
      this.teamMembers = res;
      this.clearValues();
      const values = this.processTotalValues(this.teamMembers)
      this.dataProcessed.emit(values);
      this.filteredMembers = [...this.teamMembers];
      this.spinner.hide();
    }, error => {
      this.teamMembers = [];
      this.spinner.hide();
    });

  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredMembers.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Convert strings to lowercase for consistent comparison
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
