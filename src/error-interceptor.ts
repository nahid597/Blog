
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './app/Error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(private matDialog: MatDialog){};

    intercept(req: HttpRequest<any> , next: HttpHandler)
    {
      return next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
           // console.log(error);
           // alert(error.error.message);

           let errorMessage = 'unknown error occured!!';
           
           if(error.error.message)
           {
               errorMessage = error.error.message;
           }

           this.matDialog.open(ErrorComponent, {data: {errorMessage}});
           //console.log(errorMessage);
           return throwError(error);
          })
      )
    }
}