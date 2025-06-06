import { BaseClass } from '../ytbe/models/base-class.model';

/**
 * Model for user profile
 */
export class TiUserProfile extends BaseClass {    
    private _startDate?: Date;

    status:string = '';
    company:string = '';
    username: string = '';
    title:string = '';
    firstName: string = '';
    middleName: string = '';
    lastName: string = '';
    email: string = '';
    
    set startDate(date: Date | undefined){
        this._startDate = date ? new Date(date) : date;  //Fix dates
    }
    get startDate():Date | undefined {
        return this._startDate;
    }

    get fullName():string {
        return this.firstName + " " + this.lastName;
    }
}