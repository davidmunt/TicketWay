export interface Comment {
  commentId: string;
  text: string;
  authorId: string;
  authorImage: string;
  authorUserName: string;
  userIsAuthor: boolean;
  following: boolean;
}
