
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'


@Injectable({ providedIn: 'root' })

export class PostService {

    constructor(public http: HttpClient) { };

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    public getPost() {

        this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
            .subscribe((postData) => {
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            })

    }

    public getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

    public addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };

        this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            })

    }
}