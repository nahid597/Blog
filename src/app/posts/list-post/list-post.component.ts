
import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import {Post} from '../post.model'
import {PostService} from '../post.service'
import {Subscription} from 'rxjs'
import { PageEvent } from '@angular/material';

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
     isLoading = false;
     totalPost = 0;
     postPerPage = 10;
     currentPage = 1;
     selectPostOptions = [1,5,10,20];

   constructor(public postService: PostService) {};

   ngOnInit() {
      this.isLoading = true;
      this.postService.getPost(this.postPerPage , this.currentPage); 
      this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], countPosts: number}) => {
         this.isLoading = false;
         this.totalPost = postData.countPosts;
         this.posts = postData.posts;
      });
   };

   onChangepage(pageData: PageEvent)
   {
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postPerPage = pageData.pageSize;
      this.postService.getPost(this.postPerPage , this.currentPage); 
   }

   ngOnDestroy() {
      this.postSub.unsubscribe();
   };

   onDelete(postId: string) {
      //console.log("psotId: " + postId);
      this.isLoading = true;
      this.postService.onDelete(postId).subscribe(() => {
         this.postService.getPost(this.postPerPage, this.currentPage);
      });
   }

}