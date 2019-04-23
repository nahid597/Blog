import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn: "root"})

export class AuthService {

    private durationTimer : any;
    private isAuthenticated = false;
    private  token: string;
    private authStatus = new Subject<boolean>();

    constructor(private http: HttpClient , private router: Router){}

    getToken()
    {
        return this.token;
    }

    getAuthStatus()
    {
        return this.authStatus.asObservable();
    }

    isAuth()
    {
        return this.isAuthenticated;
    }

    

    createUser(email: string, password: string)
    {
        const authData: AuthData = {email: email, password: password}
        this.http.post("http://localhost:3000/api/user/signup" , authData)
        .subscribe(response => {
            console.log(response);
        })
    }

    login(email: string, password: string)
    {
        const authData: AuthData = {email: email,  password: password}
        this.http.post<{token: string , expiresIn: number}>("http://localhost:3000/api/user/login" , authData)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token)
            {
                const expireInDuration = response.expiresIn;
              
               this.durationTimer = setTimeout(() => {
                    this.logout();
               }, expireInDuration * 1000);

                this.isAuthenticated = true;
                this.authStatus.next(true);
                const now = new Date();
                const expirationDate = new Date( now.getTime() + expireInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthDataInLocalStorage(token, expirationDate );
                this.router.navigate(['/']);
            }
        });
    }

    autoAuthUser()
    {
      const authInformation =  this.getAUthData();
      if(!authInformation)
      {
          return;
      }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

      if(expiresIn > 0)
      {
          this.token = authInformation.token;
          this.isAuthenticated = true;
          this.setAuthTimer(expiresIn / 1000);
          this.authStatus.next(true);
      }
    }

    private setAuthTimer(duration: number)
    {
        console.log("setting time: " + duration);
        this.durationTimer = setTimeout(() => {
            this.logout();
       }, duration * 1000);
    }

    logout()
    {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatus.next(false);
        clearTimeout(this.durationTimer);
        this.clearAuthDataInLocalStorage();
        this.router.navigate(['/']);
    }

    private saveAuthDataInLocalStorage(token: string, expiretionDate: Date)
    {
        localStorage.setItem('token', token);
        localStorage.setItem('expire', expiretionDate.toISOString());
    }

    private clearAuthDataInLocalStorage()
    {
        localStorage.removeItem('token');
        localStorage.removeItem('expire');
    }

    private getAUthData()
    {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expire');

        if(!token || !expirationDate)
        {
            return;
        }

        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}