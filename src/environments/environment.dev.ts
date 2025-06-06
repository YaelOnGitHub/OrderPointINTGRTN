export const environment = {
  production: false,
  baseApiEndPoint: 'https://orderpointdevapi.qpharmacorp.com/' ,
  
  baseAuthLink : 'https://orderpointdevapi.qpharmacorp.com/',
  auth: {
    loginEndPoint: 'auth/login',
    logoutEndPoint: 'auth/logout',
    changePasswordEndPoint: 'auth/changePassword',
    getInfoEndPoint: 'auth/info',
    heartbeatEndPoint: 'auth/heartbeat',
    loginRedirect: null,
    logoutRedirect: null
  },
  logging: {
    logEndPoint: 'logging'
  }
};