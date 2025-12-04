import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompanyDashboardComponentComponent } from "../../shared/company/company-dashboard/company-dashboard.component";

@Component({
  selector: "app-home",
  templateUrl: "./companyDashboard.component.html",
  styleUrls: ["./companyDashboard.component.css"],
  standalone: true,
  imports: [CommonModule, CompanyDashboardComponentComponent],
})
export class CompanyDashboardComponent {}
