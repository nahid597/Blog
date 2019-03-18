import { Component, EventEmitter, Output } from '@angular/core';
import { PostService } from '../post.service';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {

    constructor(public postService: PostService) {};
 
    enterTitle = '';
    enterContent = '';
    //@Output() createPost = new EventEmitter<Post>();
    
    onAddPost(form:NgForm) {
      this.postService.addPost(form.value.title, form.value.content );
     form.resetForm();
    }
}