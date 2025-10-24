import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Comment } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";
import { HttpParams } from "@angular/common/http";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class CommentService {
  private _comments = signal<Comment[] | null>(null);
  comments = this._comments.asReadonly();
  constructor(private apiService: ApiService) {}

  get_comments_from_concert(slug: string): Observable<Comment[]> {
    return this.apiService.get(user_port, `/comments/${slug}`).pipe(
      map((response: any) => {
        const mapped = response.comments.map((comentario: any) => ({
          commentId: comentario.commentId,
          text: comentario.text,
          authorId: comentario.author?.user_id,
          authorUserName: comentario.author?.username,
          authorImage: comentario.author?.image,
          following: comentario.author?.following,
          userIsAuthor: comentario.userIsAuthor,
        })) as Comment[];
        return mapped;
      }),
      tap((mappedComments) => {
        this._comments.set(mappedComments);
      })
    );
  }

  delete_comment_from_concert(commentId: string, concertSlug: string): Observable<any> {
    return this.apiService.delete(user_port, `/comments/${commentId}/concerts/${concertSlug}`).pipe(
      tap((response: any) => {
        if (response?.deleted === true) {
          const updated = this._comments()?.filter((c) => c.commentId !== commentId) ?? [];
          this._comments.set(updated);
        }
      })
    );
  }

  create_comment_from_concert(concertSlug: string, text: string): Observable<Comment> {
    return this.apiService.post(user_port, `/comments/${concertSlug}`, { text }).pipe(
      map((response: any) => {
        const newComment: Comment = {
          commentId: response.comment.commentId,
          text: response.comment.text,
          authorId: response.comment.author.user_id,
          authorUserName: response.comment.author.username,
          authorImage: response.comment.author.image,
          following: response.comment.author.following,
          userIsAuthor: true,
        };
        return newComment;
      }),
      tap((newComment) => {
        const updatedComments = this._comments() ? [...this._comments()!, newComment] : [newComment];
        this._comments.set(updatedComments);
      })
    );
  }
}
