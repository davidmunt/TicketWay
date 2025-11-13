import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponentComponent } from "../../shared/admin/admin-dashboard/admin-dashboard.component";

@Component({
  selector: "app-home",
  templateUrl: "./adminDashboard.component.html",
  styleUrls: ["./adminDashboard.component.css"],
  standalone: true,
  imports: [CommonModule, AdminDashboardComponentComponent],
})
export class AdminDashboardComponent {}
