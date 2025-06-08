// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseApiEndPoint: '/api/',
  baseAuthLink: '/api/',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// http://0ef2-45-40-105-118.ngrok.io/QPharma.OrderPoint/api/auth