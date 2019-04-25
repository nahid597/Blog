
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })

export class PostService {

    constructor(public http: HttpClient, public router: Router) { };

    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts:Post[], countPosts: number}>();

    public getPost(pageSize: number, currentPage: number) {

        const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
        this.http
        .get<{ message: string, posts: Post[], maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
        .pipe(map((postData) => {
            return {
             posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator,
                    
                };
            }),
            maxPosts: postData.maxPosts
        };
        }))
        .subscribe((transformPostData) => {
            this.posts = transformPostData.posts;
            this.postsUpdated.next({posts:[...this.posts],
                 countPosts: transformPostData.maxPosts});
        })
    };

    getUpdatePost(id: string) {
        return this.http.get<{_id:string, title: string, content: string, imagePath: string, creator: string}>("http://localhost:3000/api/posts/" + id);
    }

    public getPostUpdateListener(): Observable<{posts: Post[], countPosts: number }> {
        return this.postsUpdated.asObservable();
    };

    public addPost(title: string, content: string, image: File) {
        //const post: Post = { id: null, title: title, content: content };

        const postData = new FormData();
        postData.append("title", title),
        postData.append("content", content),
        postData.append("image", image),

        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
            //     const post: Post = {
            //         //...responseData,
            //          id: responseData.post.id, 
            //           title: title, 
            //           content: content,
            //           imagePath: responseData.post.imagePath
            //         }; 
            //    // post.id = responseData.post.id;
            //     this.posts.push(post);
            //     this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            })

    };

    public updatedPost(id: string, title: string, content: string, image: File | string)
    {
        let postData: Post | FormData;
       if(typeof(image) === 'object')
       {
            postData = new FormData();

            postData.append("id" , id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image);
            
       }
       else {
             postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            }
       }
        this.http.put("http://localhost:3000/api/posts/" + id, postData)
        .subscribe(response => {
            // const updatedPost = [...this.posts];
            // const oldIndexPost = updatedPost.findIndex(p => p.id === id);
            // const post: Post =  {
            //     id: id,
            //     title: title,
            //     content: content,
            //     imagePath:"",
            // }
            // updatedPost[oldIndexPost] = post;
            // this.posts = updatedPost;
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        
        });
    }

    public onDelete(postId: string) {
       return this.http.delete("http://localhost:3000/api/posts/"+postId)
        //.subscribe(() => {
            // //console.log(postId);
            // const updatedPost = this.posts.filter(post => post.id !== postId);
            // this.posts = updatedPost;
            // this.postsUpdated.next([...this.posts]);
       // });
    }


}