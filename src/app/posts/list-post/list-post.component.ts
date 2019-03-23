
import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import {Post} from '../post.model'
import {PostService} from '../post.service'
import {Subscription} from 'rxjs'

@Component({
   selector: 'app-post-list',
   templateUrl: './list-post.component.html',
   styleUrls: ['./list-post.component.css'],
})


export class ListPostComponent implements OnInit, OnDestroy {
   
    // posts = [
    //     {title: "first post", content: "this is first post"},
    //     {title: "second post", content: "this is second post"},
    //     {title: "third post", content: "this is third post"}
    // ];

   // @Input() posts:Post[] = [];

     posts:Post[] = [];
     postSub: Subscription;

   constructor(public postService: PostService) {};

   ngOnInit() {
      this.postService.getPost();
      this.postSub = this.postService.getPostUpdateListener()
      .subscribe((post: Post[]) => {
         this.posts = post;
      });
   };

   ngOnDestroy() {
      this.postSub.unsubscribe();
   };

   onDelete(postId: string) {
      //console.log("psotId: " + postId);
      this.postService.onDelete(postId);
   }

}