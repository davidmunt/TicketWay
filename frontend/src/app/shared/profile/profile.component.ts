import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { User, UserService, Profile, ProfileService, constructLoginUrlTree } from "../../core";
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
  constructor(private route: ActivatedRoute, private userService: UserService, private profileService: ProfileService, private cd: ChangeDetectorRef, private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      image: "",
      username: "",
      bio: "",
      email: "",
      password: "",
    });
  }
  profile = this.profileService.profile;
  currentUser: User;
  isAuthenticated = this.userService.isAuthenticated;
  isUser: boolean;
  profileForm: FormGroup;
  errors: Object = {};
  isSubmitting = false;
  currentView: string = "profile";

  ngOnInit(): void {
    this.isUser = false;
    this.route.data
      .pipe(
        concatMap((data: { profile: Profile }) => {
          return this.userService.currentUser.pipe(
            tap((userData: User) => {
              this.currentUser = userData;
              if (this.currentUser.username === this.profile().username) this.isUser = true;
            })
          );
        })
      )
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  // logout() {
  //   this.userService.purgeAuth();
  //   //this.router.navigateByUrl("/");
  // }

  logout() {
    this.userService.purgeAuth().subscribe({
      next: (res) => {
        console.log("Logout correcto:", res);
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        console.error("Error al hacer logout:", err);
      },
    });
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

  followUser(userName: string) {
    this.userService.isAuthenticated.subscribe((auth) => {
      if (!auth) {
        this.router.navigateByUrl(constructLoginUrlTree(this.router));
      }
      this.profileService.followUserFromProfile(userName).subscribe();
    });
  }
}
