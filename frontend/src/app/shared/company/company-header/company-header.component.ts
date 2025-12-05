import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { UserCompany, UserCompanyService } from "src/app/core";

@Component({
  selector: "app-company-header",
  templateUrl: "./company-header.component.html",
  styleUrls: ["./company-header.component.css"],
  standalone: true,
  imports: [
    // Router
    CommonModule,
    RouterLink,
  ],
})
export class CompanyHeaderComponent implements OnInit {
  currentUser: UserCompany;

  constructor(private userCompanyService: UserCompanyService, private cd: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    this.userCompanyService.currentUserCompany.subscribe((userData) => {
      if (userData) {
        this.currentUser = userData;
        this.cd.markForCheck();
      }
    });
  }

  logout() {
    this.userCompanyService.purgeAuth().subscribe();
    this.router.navigateByUrl("/");
  }
}
