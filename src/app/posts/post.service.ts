
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import {map} from 'rxjs/operators'


@Injectable({ providedIn: 'root' })

export class PostService {

    constructor(public http: HttpClient) { };

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
            })

    };

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