import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService){};

    intercept(req: HttpRequest<any> , next: HttpHandler)
    {
        const atuhToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set("Authorization" , "Bearer " + atuhToken),
        })
        return next.handle(authRequest);
    }
}