import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({

    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{

    constructor(public authService: AuthService){};

    isLoading = false;
    authStatusSub: Subscription;

    ngOnInit()
   {
       this.authStatusSub = this.authService.getAuthStatus().subscribe(authStatus => {
           this.isLoading = false;
       });
   }

    onLogin(form: NgForm) {
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy()
    {
        this.authStatusSub.unsubscribe();
    }

}