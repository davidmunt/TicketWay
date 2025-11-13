import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { User, Errors } from "../../core/models";
import { JwtService, UserService, UserAdminService, UserTypeService } from "../../core/services";
import { NoAuthGuard } from "../../core/guards";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-auth-component",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userTypeService: UserTypeService,
    private userAdminService: UserAdminService,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
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
    const username =
      this.authType === "register" ? this.authForm.get("username")?.value?.trim() : null;
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
    if (!canContinue) return;

    this.isSubmitting = true;
    this.errors = { errors: {} };
    const credentials = this.authForm.value;
    if (this.authType === "login") {
      this.userTypeService.getUserTypeRole(credentials).subscribe(
        async () => {
          const role = await this.userTypeService.getUserType();
          if (role === "admin") {
            this.userAdminService.attemptAuth("login", credentials).subscribe(
              () => {
                this.router.navigateByUrl(
                  this.route.snapshot.queryParams["returnUrl"] || "/adminDashboard"
                );
              },
              (err) => {
                this.errors = err;
                this.isSubmitting = false;
                this.cd.markForCheck();
              }
            );
          } else if (role === "user") {
            this.userService.attemptAuth("login", credentials).subscribe(
              () => {
                this.router.navigateByUrl(this.route.snapshot.queryParams["returnUrl"] || "/");
              },
              (err) => {
                this.errors = err;
                this.isSubmitting = false;
                this.cd.markForCheck();
              }
            );
          } else {
            console.warn("Tipo de usuario no reconocido:", role);
            this.errors = { errors: { body: "Tipo de usuario no válido" } };
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        },
        (err) => {
          this.errors = err;
          this.isSubmitting = false;
          this.cd.markForCheck();
        }
      );
    } else if (this.authType === "register") {
      const selectedType = (
        document.querySelector('input[name="user_type"]:checked') as HTMLInputElement
      )?.value;
      if (!selectedType) {
        this.errors = { errors: { body: "Debes seleccionar un tipo de usuario" } };
        this.isSubmitting = false;
        this.cd.markForCheck();
        return;
      }
      this.userTypeService.setUserType(selectedType);
      if (selectedType === "admin") {
        this.userAdminService.attemptAuth("register", credentials).subscribe(
          () => {
            this.router.navigateByUrl("/adminDashboard");
          },
          (err) => {
            this.errors = err;
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      } else if (selectedType === "user") {
        this.userService.attemptAuth("register", credentials).subscribe(
          () => {
            this.router.navigateByUrl("/");
          },
          (err) => {
            this.errors = err;
            this.isSubmitting = false;
            this.cd.markForCheck();
          }
        );
      } else {
        console.warn("Tipo de usuario no reconocido al registrar:", selectedType);
        this.errors = { errors: { body: "Tipo de usuario no válido" } };
        this.isSubmitting = false;
        this.cd.markForCheck();
      }
    }
  }
}
