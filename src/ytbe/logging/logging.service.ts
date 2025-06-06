import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, onErrorResumeNext } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as StackTrace from 'stacktrace-js';
import { formUrlEncoded } from '../http/form-urlencoded';
import { LogLevelType } from './log-level.type';

@Injectable()
export class LoggingService {
    
  constructor(protected http: HttpClient, protected location:Location) {
  }

  private _log(level:LogLevelType, message:string, path:string, stacktrace?:string):Observable<any>{
    const endPoint:string = environment["logging"].logEndPoint;
    const body:string = formUrlEncoded({level:level, message:message, path:path, stackTrace:stacktrace}); //Call utility function to form-encode request
    const req = this.http.post(endPoint, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      }).pipe(catchError((err, caught) => {
        return onErrorResumeNext(err);
      }));
    return req;
  }

  /**
   * 
   * @param level Log level type to use for logging the message
   * @param error Exception to log (message is obtained from the exception)
   */
  logError(level:LogLevelType, error:any):void{
    this.log(level, '', error);
  }

  /**
   * 
   * @param level Log level type to use for logging the message
   * @param message Message to log
   * @param error Exception to log
   */
  log(level:LogLevelType, message:string, error?:any):void{
    const path:string = this.location.path(); //Get the url

    if (error){    
      message = message ? message : (error.message ? error.message : error.toString());
      
      //Get the last 25 lines
      if (error.stack || error.description) { //Check for proper error object for stack parsing
        StackTrace.fromError(error).then((stackframes: any[]) => {
            const stacktrace:string = stackframes
                .splice(0, 25)
                .map(function(sf) {
                    return sf.toString();
                }).join('\n');
            
            this._log(level, message, path, stacktrace).subscribe();
        });
      } else {
        this._log(level, message, path).subscribe(); //Handle error without stack trace
      }
    } else {
          this._log(level, message, path).subscribe();
    }
  }
}
