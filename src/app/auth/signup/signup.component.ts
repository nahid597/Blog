import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy{

    constructor(public authService: AuthService){};

    isLoadin = false;
   private authStatusSub: Subscription;


   ngOnInit()
   {
       this.authStatusSub = this.authService.getAuthStatus().subscribe(authStatus => {
           this.isLoadin = false;
       });
   }

   

    onSignup(formData: NgForm)
    {
        if(formData.invalid)
        {
            return;
        }

        this.isLoadin = true;
        this.authService.createUser(formData.value.email, formData.value.password);
    }


    ngOnDestroy()
    {
        this.authStatusSub.unsubscribe();
    }


}