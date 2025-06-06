import { BaseClass } from "../models/base-class.model";

/**
 *Model for basic user info
 * */
export class AuthUser extends BaseClass {
  username: string = '';
  firstName: string= '';
  mi: string= '';
  lastName: string= '';
  email: string= '';
  roles: string[] = [];

  get fullName(): string {
    return [this.firstName, this.mi? this.mi+'.' : '', this.lastName].join(' ');
  }

  constructor(init?: Partial<AuthUser>) {
    super();
    this.init(init);
  }
}
