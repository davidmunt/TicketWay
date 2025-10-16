import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { User, UserService, Profile } from "../../core";
import { concatMap, tap } from "rxjs/operators";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-settings-user",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  user: User = {} as User;
  settingsForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.settingsForm = this.fb.group({
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    });
  }

  ngOnInit() {
    Object.assign(this.user, this.userService.getCurrentUser());
    this.settingsForm.patchValue(this.user);
  }

  updateUser(values: Object) {
    Object.assign(this.user, values);
  }

  submitForm() {
    this.isSubmitting = true;
    this.updateUser(this.settingsForm.value);
    this.userService.update(this.user).subscribe((updatedUser) => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User successfully updated",
      }).then(() => {
        this.router.navigateByUrl("/home");
      });
    });
  }
}
