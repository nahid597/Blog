import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

    constructor(public postService: PostService, public router: ActivatedRoute) {};
 
    enterTitle = '';
    enterContent = '';
    private mode = 'create';
    private postId : string;
    post: Post;
    isLoading = false;
    //@Output() createPost = new EventEmitter<Post>();

   
    ngOnInit()
    {
        this.router.paramMap.subscribe((paramMap: ParamMap) => {
           if( paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postService.getUpdatePost(this.postId)
                .subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content
                    }
                });
           }
           else{
            this.mode = 'create'
            this.postId = null;
           }
        })
    }

    public onSavePost(form:NgForm) {
        
        this.isLoading = true;
        if(this.mode === 'create' )
        {
            this.postService.addPost(form.value.title, form.value.content );
        }
        else
        {
            this.postService.updatedPost(this.postId, form.value.title, form.value.content);
        }
        
       form.resetForm();
      }


   
}