import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import { User, UserService, Profile } from "../../core";
import { concatMap, tap } from "rxjs/operators";

@Component({
  selector: "app-profile-component",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService, private cd: ChangeDetectorRef, private router: Router) {}

  profile: Profile;
  currentUser: User;
  isUser: boolean;

  ngOnInit() {
    console.log("ProfileComponent initialized");
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

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl("/");
  }
}
