import { ActivatedRoute, Params } from "@angular/router";
import { BaseClass } from "../../../ytbe/models/base-class.model";

/**
 * Model for user info
 * Test string: ?clientappkey=GLAXO_OrderPoint&key=9eg7y0ujht&fromGskGrc=n&SOURCESITE=O&SERVICEREQUESTID=01011936&REPID=KB414513&CONTACTTYPE=H&BUSINESSNAME=&PREFIXNAME=&FIRSTNAME=JENIFFER&LASTNAME=SAUNDERS&CID=&SPECIALTY=&SUFFIXNAME=&ADDRESS1=4665%2044TH%20ST%20SE&ADDRESS2=SUITE%20A&CITY=GRAND%20RAPIDS&STATE=MI&ZIPCODE=49516&PHONE=6169779700&FAX=&EMAIL=
 */
export class ExtDataModel extends BaseClass {
    clientAppKey: string = '';
    key: string = '';
    fromGskGrc: boolean = false;
    sourceSite: string = '';
    serviceRequestId: string = '';
    repId:string = '';
    contactType:string = '';
    businessName:string = '';
    prefixName:string = '';
    firstName:string='';
    lastName:string ='';
    cid:string ='';
    specialty:string ='';
    suffixName:string ='';
    address1:string ='';
    address2:string ='';
    city:string ='';
    state:string ='';
    zipCode:string ='';
    phone:string ='';
    fax:string ='';
    email:string ='';

    constructor(init?: Partial<ExtDataModel>) {
        super();
        this.init(init);
    }

    /**
     * Create ExtaDataModel from query string parameters
     * @param params Query string parameters from which to creat ethe object
     * @returns 
     */
    public static fromQueryStringParams(params:Params):ExtDataModel{        
        let model = new ExtDataModel();
        for (var p in model) {
            switch (p) {
                case 'clientAppKey':
                    model.clientAppKey = params[p] || params[p.toLowerCase()] || params[p.toUpperCase()] || params['samlclientappkey'.toLowerCase()] || params['samlclientappkey'.toUpperCase()];
                    break;
                case 'fromGskGrc':
                    model.fromGskGrc = params['fromGskGrc']?.toLowerCase() === 'y' || params['fromGskGrc']?.toLowerCase() === 'true' || params['fromGskGrc']  === '1';
                    break;
                default:
                    (model as any)[p] = params[p] || params[p.toLowerCase()] || params[p.toUpperCase()];
                    break;
            }
        }
        model.fromGskGrc = params['fromGskGrc']?.toLowerCase() === 'y' || params['fromGskGrc']?.toLowerCase() === 'true' || params['fromGskGrc']  === '1';

        return model;
    }
}
