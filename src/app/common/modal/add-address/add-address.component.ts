import { Component, ContentChild, Directive, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from 'src/app/shared/address.service';
import { ToasterService } from 'src/app/shared/toaster.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  value: string = '';
  @Input() address: any;
  constructor
  (private _toast: ToasterService,
    public fb: FormBuilder, 
    public modal: NgbActiveModal, 
    private addressService: AddressService) { }

  isEdit: boolean = false;
  mod: any = {};
  remoteError: string = '';
  submitted: boolean = false;
  btn = false;
  selectedCountry: { value: string; text: string } = {
    value: '',
    text: ''
  };
  selectedState: { value: string; text: string } = {
    value: '',
    text: '',
  };
  typeAheadState: { text: string; state:{ value: string; text: string }| undefined; updated: number|undefined } = {
    text: '',
    state: undefined,
    updated: undefined
  };

  countries = [
    { value: "US", text: "United States of America" },
    { value: "CA", text: "Canada" },
  ];

  states: { [key: string]: any } = {
    "US": [
      { value: "AL", text: "Alabama" },
      { value: "AK", text: "Alaska" },
      { value: "AS", text: "American Samoa" },
      { value: "AZ", text: "Arizona" },
      { value: "AR", text: "Arkansas" },
      { value: "CA", text: "California" },
      { value: "CO", text: "Colorado" },
      { value: "CT", text: "Connecticut" },
      { value: "DE", text: "Delaware" },
      { value: "DC", text: "District Of Columbia" },
      { value: "FM", text: "Federated States Of Micronesia" },
      { value: "FL", text: "Florida" },
      { value: "GA", text: "Georgia" },
      { value: "GU", text: "Guam" },
      { value: "HI", text: "Hawaii" },
      { value: "ID", text: "Idaho" },
      { value: "IL", text: "Illinois" },
      { value: "IN", text: "Indiana" },
      { value: "IA", text: "Iowa" },
      { value: "KS", text: "Kansas" },
      { value: "KY", text: "Kentucky" },
      { value: "LA", text: "Louisiana" },
      { value: "ME", text: "Maine" },
      { value: "MH", text: "Marshall Islands" },
      { value: "MD", text: "Maryland" },
      { value: "MA", text: "Massachusetts" },
      { value: "MI", text: "Michigan" },
      { value: "MN", text: "Minnesota" },
      { value: "MS", text: "Mississippi" },
      { value: "MO", text: "Missouri" },
      { value: "MT", text: "Montana" },
      { value: "NE", text: "Nebraska" },
      { value: "NV", text: "Nevada" },
      { value: "NH", text: "New Hampshire" },
      { value: "NJ", text: "New Jersey" },
      { value: "NM", text: "New Mexico" },
      { value: "NY", text: "New York" },
      { value: "NC", text: "North Carolina" },
      { value: "ND", text: "North Dakota" },
      { value: "MP", text: "Northern Mariana Islands" },
      { value: "OH", text: "Ohio" },
      { value: "OK", text: "Oklahoma" },
      { value: "OR", text: "Oregon" },
      { value: "PW", text: "Palau" },
      { value: "PA", text: "Pennsylvania" },
      { value: "PR", text: "Puerto Rico" },
      { value: "RI", text: "Rhode Island" },
      { value: "SC", text: "South Carolina" },
      { value: "SD", text: "South Dakota" },
      { value: "TN", text: "Tennessee" },
      { value: "TX", text: "Texas" },
      { value: "UT", text: "Utah" },
      { value: "VT", text: "Vermont" },
      { value: "VI", text: "Virgin Islands" },
      { value: "VA", text: "Virginia" },
      { value: "WA", text: "Washington" },
      { value: "WV", text: "West Virginia" },
      { value: "WI", text: "Wisconsin" },
      { value: "WY", text: "Wyoming" }
    ],
    "CA": [
      { value: "AB", text: "Alberta" },
      { value: "BC", text: "British Columbia" },
      { value: "MB", text: "Manitoba" },
      { value: "NB", text: "New Brunswick" },
      { value: "NL", text: "Newfoundland and Labrador" },
      { value: "NS", text: "Nova Scotia" },
      { value: "NT", text: "Northwest Territories" },
      { value: "NU", text: "Nunavut" },
      { value: "ON", text: "Ontario" },
      { value: "PE", text: "Prince Edward Island" },
      { value: "QC", text: "Quebec" },
      { value: "SK", text: "Saskatchewan" },
      { value: "YT", text: "Yukon" }
    ]
  };

  specialCharRegex = /^[0-9a-zA-Z \b\.—,_-]+$/;
  numRegex = '[0-9]+';
  form = this.fb.group({
    address1: ['', [Validators.required, Validators.pattern(this.specialCharRegex), Validators.minLength(3), Validators.maxLength(255)]],
    address2: ['', [Validators.pattern(this.specialCharRegex), Validators.minLength(3), Validators.maxLength(255)]],
    city: ['', [Validators.required, Validators.pattern(this.specialCharRegex), Validators.minLength(3), Validators.maxLength(255)]],
    state: ['', Validators.required],
    country: ['US', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(this.numRegex), Validators.maxLength(5)]],
    zip4: ['', [Validators.pattern(this.numRegex), Validators.maxLength(4)]]
  });
  ngOnInit(): void {

    if (this.address != '') {
      this.isEdit = true;
      this.mod = this.address || { country: "US" };
    }

    this.addressService.getCountryDropdown().subscribe((data: any) => {
      const country = data.Iso2;
      const selectedItem = this.countries.filter(el => el.value === country);
      this.selectedCountry = selectedItem.length > 0 ? selectedItem[0] : {
        value: '',
        text: ''
      };
      this.form.patchValue({ country: this.selectedCountry.value });
      this.form.controls['country'].markAsTouched();
      
      let address = this.mod;
      if (address && address.country && address.state) {
        this.form.patchValue(address);
        this.selectedCountry = this.countries.filter(el => el.value === address.country)[0];
        this.selectedState = this.states[address.country].filter((el: any) => el.value === address.state)[0]
        this.btn = true;
      }
    });


    this.form.get('country')?.valueChanges.subscribe(val => {
      if (val === 'US') {
        this.form.controls['zip'].setValidators([Validators.required, Validators.maxLength(5), Validators.pattern(this.numRegex)]);
        this.form.controls['zip4'].setValidators([Validators.maxLength(4), Validators.pattern(this.numRegex)]);
      }

      if (val === 'CA') {
        this.form.controls['zip'].setValidators([Validators.required, Validators.maxLength(7), Validators.pattern('^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] [0-9][ABCEGHJ-NPRSTV-Z][0-9]$')]); //No need to make case-insensitive; value already converted to uppercase
        this.form.controls['zip4'].clearValidators();

      }
      this.form.controls['zip'].updateValueAndValidity();
      this.form.controls['zip4'].updateValueAndValidity();
    });
  }

  submitAddress(): void {
    this.submitted = true;
    //Validate
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.remoteError = '';
    this.addressService.validateAddress(this.form.value).subscribe((res) => {
      if (res.IsValid) {
        this.modal.close(this.form.value);
      } else {
        this.remoteError = res.ErrorMessage;
        this._toast.showError(this.remoteError, 'ERROR');
      }
    });
  }
  onCloseModal() {
    this.modal.dismiss();
  }

  selectCountry(country: { value: string; text: string }) {
    this.selectedCountry = country;
    this.form.patchValue({ country: this.selectedCountry.value });
    this.form.controls['country'].markAsTouched();

    this.selectedState = {
      value: '',
      text: ''
    };
    this.form.patchValue({ state: this.selectedState.value });
  }

  selectState(state: { value: string; text: string }) {
    this.selectedState = {value:state.value, text:state.text};

    this.form.patchValue({ state: this.selectedState.value });
    this.form.controls['state'].markAsTouched();    
  }

  @ViewChild('dropdownState',{ read: NgbDropdown }) private dropdownState:NgbDropdown | undefined;
  @ViewChildren('dropdownStateItems') private dropdownStateItems: QueryList<ElementRef> | undefined;
  typeAheadStateKeyUp(event:any){
    let key = window.event ? event.keyCode : event.which;

    let states = this.states[this.selectedCountry.value];

    let ticks = new Date().getTime();

    if (key == 40 || key == 38) //Next or previous
    { 
      let state = this.typeAheadState.state || this.selectedState;
      
      let index = states.indexOf(state);

      if (index != undefined){
        if (key == 38 && index > 0){
          //Up
          (index as number)--;
          this.typeAheadState.state = states[index as number];
        }
        else if (key == 40 && index < states.length-1)
        {
          //Down
          (index as number)++;
          this.typeAheadState.state = states[index as number];
        }
        const elementToScrollInto:ElementRef|undefined = this.dropdownStateItems?.find(el => el.nativeElement.id === 'add-state-' + this.typeAheadState.state?.value);
        elementToScrollInto?.nativeElement.scrollIntoView();
      }
      this.typeAheadState.updated = ticks;      
    }
    else if (key == 13){
      if (this.dropdownState?.isOpen()){
        if (this.typeAheadState.state) this.selectedState = this.typeAheadState.state;
        this.dropdownState?.close();
      } else {
        this.dropdownState?.open();
      }
    }
    else //Handle keypress
    { 
      if(!this.typeAheadState.updated || ((this.typeAheadState.updated + 1000) >= ticks)){
        this.typeAheadState.text += String.fromCharCode(key);
      } else {
        this.typeAheadState.text = String.fromCharCode(key);
      }
      this.typeAheadState.updated = ticks;
      
      //Capture matching state and its index within the array
      let stateIndex = -1;
      let state = states.find((state:any, index:number) => 
        { 
          let match:boolean = state.text.toUpperCase().indexOf(this.typeAheadState.text)==0;
          if (match) stateIndex = index;
          return match;
        } 
      );
      if (state) {
        this.typeAheadState.state = state;

        const elementToScrollInto:ElementRef|undefined = this.dropdownStateItems?.find(el => el.nativeElement.id === 'add-state-' + this.typeAheadState.state?.value);
        elementToScrollInto?.nativeElement.scrollIntoView();
      }  
    }
     

  }
  dropdownStateOpenChange(event:boolean){
    this.typeAheadState.updated = undefined;
    this.typeAheadState.text = '';
    this.typeAheadState.state = undefined;
  }
  
  get f(): any {
    return this.form.controls;
  }

  get address1Get(): any {
    return this.form.get('address1')
  }

  get countryValue(): any {
    return this.form.get('country')?.value;
  }

  reset() {
    this.selectedCountry = {
      value: '',
      text: ''
    };
    this.selectedState = {
      value: '',
      text: ''
    };
    this.submitted = false;
    this.form.reset();
    this.form.patchValue({ country: '' });
  }
}
