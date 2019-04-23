import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

     userAuthenticated = false;
    private authListerSubs: Subscription;

    constructor(public authService: AuthService){};

    ngOnInit()
    {
        this.userAuthenticated = this.authService.isAuth();
        this.authListerSubs = this.authService.getAuthStatus()
        .subscribe(isAuthenticated => {
            this.userAuthenticated = isAuthenticated;
        });
    }

    onLogout() {
      this.authService.logout(); 
    }

    ngOnDestroy()
    {
        this.authListerSubs.unsubscribe();
    }
}