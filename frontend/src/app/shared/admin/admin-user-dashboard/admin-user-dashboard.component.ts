import { Component, OnInit, Input } from "@angular/core";
import { CommentService, UserAdminService } from "../../../core/services";
import { CommonModule } from "@angular/common";
import { Errors } from "src/app/core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-admin-user-dashboard",
  templateUrl: "./admin-user-dashboard.component.html",
  styleUrls: ["./admin-user-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminUserDashboardComponent implements OnInit {
  @Input() slug!: string;

  users = this.userAdminService.users;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  commentForm: FormGroup;

  constructor(private userAdminService: UserAdminService, private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      text: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.userAdminService.getAllUsers().subscribe();
  }

  onIsActiveChange(event: Event, username: string) {
    const value = (event.target as HTMLSelectElement).value === "true";
    this.updateIsActiveUser(username, value);
  }

  updateIsActiveUser(username: string, isActive: boolean) {
    this.userAdminService.changeIsActiveUser(username, isActive).subscribe();
  }
}
