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
      this.authType = data[data.length - 1].path;
      this.title = this.authType === "login" ? "Sign in" : "Sign up";
      if (this.authType === "register") {
        this.authForm.addControl("username", new FormControl());
      }
      this.cd.markForCheck();
    });
  }

  verifyForm(): boolean {
    const email = this.authForm.get("email")?.value?.trim();
    const password = this.authForm.get("password")?.value;
    const username = this.authType === "register" ? this.authForm.get("username")?.value?.trim() : null;
    const localErrors: string[] = [];
    if (this.authType === "register" && !username) {
      localErrors.push("El nombre de usuario es obligatorio");
    }
    if (!email) {
      localErrors.push("El email es obligatorio");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) localErrors.push("El formato del email no es válido");
    }
    if (!password) {
      localErrors.push("La contraseña es obligatoria");
    } else if (password.length < 6) {
      localErrors.push("La contraseña debe tener al menos 6 caracteres");
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        localErrors.push("La contraseña debe tener una mayúscula, una minúscula y un número");
      }
    }
    if (localErrors.length > 0) {
      this.errors = { errors: { body: localErrors[0] } };
      return false;
    }
    return true;
  }

  submitForm() {
    const canContinue = this.verifyForm();
    if (canContinue) {
      this.isSubmitting = true;
      this.errors = { errors: {} };
      const credentials = this.authForm.value;
      this.userService.attemptAuth(this.authType, credentials).subscribe(
        () => {
          this.router.navigateByUrl(this.route.snapshot.queryParams["returnUrl"] || "/");
        },
        (err) => {
          this.errors = err;
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      );
    }
  }
}
