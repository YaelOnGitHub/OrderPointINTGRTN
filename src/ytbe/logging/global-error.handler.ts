import { environment } from '../../environments/environment';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import * as StackTrace from 'stacktrace-js';
import { LoggingService } from './logging.service';
import { LogLevelTypes } from './log-level.type';
//import { DialogService } from '../kendo/dialog/dialog.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
    /**
     * Holds reference to a timer that prevents logging of duplicate errors
     */
    private static _timeout : NodeJS.Timeout | undefined = undefined;

    constructor(private _injector: Injector) {
        super();
    }

    override handleError(error: { message: string; toString: () => string; name: string; }) {
      const loggingService: LoggingService = this._injector.get(LoggingService); //Get the logging service

        //Use error message if available or "toString" when not
        const message:string = error.message ? error.message : error.toString();
        
        //Helps prevent duplicate calls.  Also prevent duplicate handlig of HttpErrorResponses
        if (GlobalErrorHandler._timeout == undefined && error.name !== "HttpErrorResponse") {
            GlobalErrorHandler._timeout = setTimeout(function(){
                //Log the error on the server
                if (loggingService){
                    loggingService.log(LogLevelTypes.Error.value, message, error);
                }
                GlobalErrorHandler._timeout = undefined;
            }, 250);
        }
        if (!environment.production) throw error; //Rethrow when not in production
    }  
}
