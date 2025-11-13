import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { User, UserService } from "src/app/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  standalone: true,
  imports: [
    // Router
    CommonModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  currentUser: User;

  constructor(private userService: UserService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((userData) => {
      this.currentUser = userData;
      this.cd.markForCheck();
    });
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl("/");
  }
}
