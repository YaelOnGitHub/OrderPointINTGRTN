export const environment = {
  production: false,
  baseApiEndPoint: 'https://orderpointapi.qpharmasit.com/' ,

  baseAuthLink : 'https://orderpointapi.qpharmasit.com/',
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