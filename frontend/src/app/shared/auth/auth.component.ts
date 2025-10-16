import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { User, Errors } from "../../core/models";
import { JwtService, UserService } from "../../core/services";
import { NoAuthGuard } from "../../core/guards";
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ShowAuthedDirective } from "src/app/shared";

@Component({
  selector: "app-auth-component",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  authType: string = "";
  title: string = "";
  errors: Errors = { errors: {} };
  isSubmitting = false;
  authForm: FormGroup;
  ngOnInit() {
    this.route.url.subscribe((data) => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = this.authType === "login" ? "Sign in" : "Sign up";
      // add form control for username if this is the register page
      if (this.authType === "register") {
        this.authForm.addControl("username", new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  submitForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    const credentials = this.authForm.value;
    this.userService.attemptAuth(this.authType, credentials).subscribe(
      (data) => {
        this.router.navigateByUrl("/");
      },
      (err) => {
        this.errors = err;
        this.isSubmitting = false;
        this.cd.markForCheck();
      }
    );
  }
}
