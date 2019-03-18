
import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs'


@Injectable({providedIn: 'root'})

export class PostService {

    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

   public getPost() {
       return  [...this.posts];
    }

   public getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable();
    }

   public addPost(title: string, content: string) {
        const post: Post = {title: title , content: content} 
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}