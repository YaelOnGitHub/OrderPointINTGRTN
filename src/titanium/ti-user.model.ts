import { BaseClass } from "../ytbe/models/base-class.model";

/**
 * Model for user info
 */
export class TiUser extends BaseClass {
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    homeClientId: string = '';
    clients:TiClient[] = [];
    logoutUrl?: string;
    themeType: number = 0;
    impersonator: string = '';
    ssoUser:boolean = false;

    /**
     * Gets the user's full name
     * @returns Full name
     */
    getFullName() {
        return [this.firstName, this.lastName].join(' ');
    }
    /**
     * Gets the user's home client
     * @returns Home client object
     */
    getHomeClient() {
        return this.clients.filter(c => c.id === this.homeClientId)[0];
    }
    /**
     * Gets the first (default) role for the user's home client
     * @returns Home client role
     */
    getHomeRole() {
        return this.getHomeClient().roles[0];
    }

    constructor(init?: Partial<TiUser>) {
        super();
        this.init(init);
    }
}
  
/**
 * Model for client info
 */
export class TiClient {
    id:string = '';
    name:string= '';
    isDefault:boolean = true;
    roles:TiRole[] = []
    logoImageUrl:string = '';
}
/**
 * Model for role info
 */
export class TiRole {
    name: string= ''; 
    rank: number = -1;
}