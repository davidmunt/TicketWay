import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../shared/layout/header/header.component";
import { AdminHeaderComponent } from "../shared/admin/admin-header/admin-header.component";
import { CompanyHeaderComponent } from "../shared/company/company-header/company-header.component";
import { FooterComponent } from "../shared/layout/footer/footer.component";
import { UserService } from "../core/services/user.service";
import { JwtService } from "../core/services/jwt.service";
import { UserAdminService } from "../core/services/useradmin.service";
import { UserCompanyService } from "../core/services/usercompany.service";
import { UserTypeService } from "../core/services/role.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  standalone: true,
  imports: [RouterModule, HeaderComponent, AdminHeaderComponent, CompanyHeaderComponent, FooterComponent, HttpClientModule, CommonModule],
})
export class MainComponent implements OnInit {
  usertype: string | null = null;
  isLoaded = false;

  constructor(
    private userService: UserService,
    private userAdminService: UserAdminService,
    private userCompanyService: UserCompanyService,
    private userTypeService: UserTypeService
  ) {}

  ngOnInit(): void {
    this.userTypeService.userType$.subscribe((userType) => {
      this.usertype = userType;
      this.isLoaded = true;

      if (userType === "user") {
        this.userService.populate();
      } else if (userType === "admin") {
        this.userAdminService.populate();
      } else if (userType === "company") {
        this.userCompanyService.populate();
      }
    });
  }
}
