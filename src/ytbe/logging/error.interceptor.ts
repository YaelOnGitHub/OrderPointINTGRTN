
import { throwError as observableThrowError, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';



//import { DialogService } from '../kendo/dialog/dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(/*protected dialogService:DialogService*/){
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error, caught: Observable<any>) => {
          if (error && error.error && typeof(error.error) === "string") error.error = JSON.parse(error.error); //Attempt to parse errors as JSON (corrects bug in Angular)

          //TODO: Refactor with notification service
          //Notify the user
          //if (this.dialogService && error.status != 400){ //Ignore unauthorized errors
          //    let message:string = "";
            
          //    if (error.error && error.error.message){
          //        message = error.error.message;
          //    } else if (error.status == 0) {                
          //        //Message for connection error
          //        message = "An unknown error occurred while connecting to the server. Please try again later.";
          //    } else {
          //        message = "An unknown error occurred, please try again later."; //Default message
          //    }
            
          //    this.dialogService.openAsObservable({
          //        title:"Server Error",
          //        content: message,
          //        actions:[{text:"Close", primary:true}]
          //    }).subscribe();
          //}
          return throwError(() => error);
        })
      );
  }
}
