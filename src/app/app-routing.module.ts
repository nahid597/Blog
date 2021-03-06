
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import { ListPostComponent } from './posts/list-post/list-post.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGard } from './auth/auth-gard';

const routes: Routes = [
    {path: '' , component: ListPostComponent},
    {path: 'create' , component: PostCreateComponent, canActivate:[AuthGard] },
    {path: 'edit/:postId' , component: PostCreateComponent, canActivate:[AuthGard] },
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers:[AuthGard]
})

export class AppRoutingModule{}