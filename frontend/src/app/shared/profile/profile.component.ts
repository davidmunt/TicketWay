import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { User, UserService, Profile } from "../../core";
import { concatMap, tap } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { SettingsComponent } from "../settings/settings.component";

@Component({
  selector: "app-profile-component",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, SettingsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService, private cd: ChangeDetectorRef, private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    });
  }

  profile: Profile;
  currentUser: User;
  isUser: boolean;
  user: User = {} as User;
  profileForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;
  currentView: string = "profile";

  // ngOnInit() {
  //   this.route.data
  //     .pipe(
  //       concatMap((data: { profile: Profile }) => {
  //         this.profile = data.profile;
  //         return this.userService.currentUser.pipe(
  //           tap((userData: User) => {
  //             this.user = userData;
  //             this.isUser = this.user.username === this.profile.username;
  //           })
  //         );
  //       })
  //     )
  //     .subscribe(() => {
  //       this.cd.markForCheck();
  //     });
  // }

  ngOnInit() {
    this.route.data
      .pipe(
        concatMap((data: { profile: Profile }) => {
          this.profile = data.profile;
          return this.userService.currentUser.pipe(
            tap((userData: User) => {
              this.currentUser = userData;
              this.isUser = this.currentUser.username === this.profile.username;
            })
          );
        })
      )
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  // ngOnInit() {
  //   // let username = this.route.params["username"];
  //   this.userService.getUserProfile().subscribe({
  //     next: (userProfile) => {
  //       this.user = userProfile;
  //       this.profileForm.patchValue(this.user);
  //       this.cd.detectChanges();
  //     },
  //     error: (err) => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Failed to load user profile.",
  //       });
  //     },
  //   });
  // }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl("/");
  }

  showProfile() {
    this.currentView = "profile";
  }

  showFavorites() {
    this.currentView = "favorites";
  }

  showSettings() {
    this.currentView = "settings";
  }

  isActive(view: string): boolean {
    return this.currentView === view;
  }
}
