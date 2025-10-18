import { Component, OnInit, Input } from "@angular/core";
import { CommentService } from "../../core/services";
import { CommonModule } from "@angular/common";
import { Errors } from "src/app/core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { constructLoginUrlTree } from "src/app/core";

@Component({
  selector: "app-comment-concert",
  templateUrl: "./comment-concert.component.html",
  styleUrls: ["./comment-concert.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class CommentConcertComponent implements OnInit {
  @Input() slug!: string;

  comments = this.commentService.comments;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  commentForm: FormGroup;

  constructor(private commentService: CommentService, private route: ActivatedRoute, private readonly router: Router, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      text: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.slug) {
      this.commentService.get_comments_from_concert(this.slug).subscribe();
      console.log(this.comments);
    }
  }

  deleteComment(commentId) {
    this.commentService.delete_comment_from_concert(commentId, this.slug).subscribe();
  }

  createComment() {
    this.isSubmitting = true;
    this.errors = { errors: {} };
    const { text } = this.commentForm.value;
    this.commentService.create_comment_from_concert(this.slug, text).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Comment added",
        });
        this.commentForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl(constructLoginUrlTree(this.router));
      },
    });
  }
}
