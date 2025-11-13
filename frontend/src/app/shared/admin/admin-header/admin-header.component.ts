import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { UserAdmin, UserAdminService } from "src/app/core";

@Component({
  selector: "app-admin-header",
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.css"],
  standalone: true,
  imports: [
    // Router
    CommonModule,
    RouterLink,
  ],
})
export class AdminHeaderComponent implements OnInit {
  currentUser: UserAdmin;

  constructor(
    private UserAdminService: UserAdminService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.UserAdminService.currentUserAdmin.subscribe((userData) => {
      if (userData) {
        this.currentUser = userData;
        this.cd.markForCheck();
      }
    });
  }

  logout() {
    this.UserAdminService.purgeAuth().subscribe({
      next: () => {
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        console.error("Error durante el logout:", err);
      },
    });
  }
}
