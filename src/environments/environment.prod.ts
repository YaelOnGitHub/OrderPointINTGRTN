export const environment = {
  production: false,
  baseApiEndPoint: 'https://op2api.qpharmacorp.com/' ,

  baseAuthLink : 'https://op2api.qpharmacorp.com/',
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