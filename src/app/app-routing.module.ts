
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import { ListPostComponent } from './posts/list-post/list-post.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

const routes: Routes = [
    {path: '' , component: ListPostComponent},
    {path: 'create' , component: PostCreateComponent },
    {path: 'edit/:postId' , component: PostCreateComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})

export class AppRoutingModule{}