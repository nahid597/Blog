
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
                    id: post._id
                }
            })
        }))
        .subscribe((transformPost) => {
            this.posts = transformPost;
            this.postsUpdated.next([...this.posts]);
        })
    };

    getUpdatePost(id: string) {
        return this.http.get<{_id:string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    }

    public getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    };

    public addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };

        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                 post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            })

    };

    public updatedPost(id: string, title: string, content: string)
    {
        const post: Post = {
            id: id,
            title: title,
            content: content
        }
        this.http.put("http://localhost:3000/api/posts/" + id, post)
        .subscribe(response => {
            const updatedPost = [...this.posts];
            const oldIndexPost = updatedPost.findIndex(p => p.id === post.id);
            updatedPost[oldIndexPost] = post;
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        
        });
    }

    public onDelete(postId: string) {
        this.http.delete("http://localhost:3000/api/posts/"+postId)
        .subscribe(() => {
           // console.log(postId);
            const updatedPost = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPost;
            this.postsUpdated.next([...this.posts]);
        });
    }


}