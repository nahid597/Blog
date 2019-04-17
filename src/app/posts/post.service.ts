
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
    private postsUpdated = new Subject<Post[]>();

    public getPost() {

        this.http
        .get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                    
                }
            });
        }))
        .subscribe((transformPost) => {
            this.posts = transformPost;
            this.postsUpdated.next([...this.posts]);
        })
    };

    getUpdatePost(id: string) {
        return this.http.get<{_id:string, title: string, content: string, imagePath: string}>("http://localhost:3000/api/posts/" + id);
    }

    public getPostUpdateListener(): Observable<Post[]> {
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
                const post: Post = {
                    //...responseData,
                     id: responseData.post.id, 
                      title: title, 
                      content: content,
                      imagePath: responseData.post.imagePath
                    }; 
               // post.id = responseData.post.id;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
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
                imagePath: image
            }
       }
        this.http.put("http://localhost:3000/api/posts/" + id, postData)
        .subscribe(response => {
            const updatedPost = [...this.posts];
            const oldIndexPost = updatedPost.findIndex(p => p.id === id);
            const post: Post =  {
                id: id,
                title: title,
                content: content,
                imagePath:"",
            }
            updatedPost[oldIndexPost] = post;
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        
        });
    }

    public onDelete(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/"+postId)
        .subscribe(() => {
            console.log(postId);
            const updatedPost = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
        });
    }


}