import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import{mimeType} from './mime-type.validator'


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
    form: FormGroup;
    imagePreview: string;
    //@Output() createPost = new EventEmitter<Post>();
   
    ngOnInit()
    {
        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}),
            image: new FormControl(null, {validators:[], asyncValidators:[mimeType]})
        }) 
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
                        content: postData.content,
                        imagePath: postData.imagePath,
                        creator: postData.creator,
                    }
                this.form.setValue({
                    title: this.post.title,
                     content: this.post.content,
                     image: this.post.imagePath,
                    });
                });
           }
           else{
            this.mode = 'create'
            this.postId = null;
           }
        })
    }

    onImagePicker(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();

        reader.onload = () => {
            this.imagePreview = reader.result as string;
        }

        reader.readAsDataURL(file);
    }

    public onSavePost() {
        
        this.isLoading = true;
        if(this.mode === 'create' )
        {
            this.postService.addPost(
                this.form.value.title,
                 this.form.value.content,
                 this.form.value.image
                  );
        }
        else
        {
            this.postService.updatedPost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        
       this.form.reset();
      }


   
}