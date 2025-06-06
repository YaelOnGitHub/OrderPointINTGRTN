//Update on 2/22/2022 to match original application ENUM in API
export enum Role {
    /**
     * Administrator
     */
    Admin = 30,
    /**
     * IT Administrator
     */
    ITAdmin = 80,
    /**
     * Home Office
     */
    HomeOffice = 50,
    /**
     * Call Center = Not in use for this version of the application
     */
    CallCenter = 40,
    /**
     * Regional Business Director - Same behavior as District Manager
     */
    RegionalBusinessDirector = 90,
    /**
     * District Manager
     */
    DistrictManager = 60,
    /**
     * Sales Rep
     */
    
    SalesRep = 70 ,

    NormalUser = 10
}
// Normal User: 10
// Manager: 20
// Admin: 30
// Call Center: 40
// Home Office: 50
// District MAnager: 60
// Sales Rep: 70
// IT Admin: 80
// Regional Business Director: 90