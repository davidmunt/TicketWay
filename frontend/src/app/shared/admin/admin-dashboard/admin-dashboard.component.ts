import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminUserDashboardComponent } from "../admin-user-dashboard/admin-user-dashboard.component";
import { AdminArtistDashboardComponent } from "../admin-artist-dashboard/admin-artist-dashboard.component";
import { AdminCategoryDashboardComponent } from "../admin-category-dashboard/admin-category-dashboard.component";
import { AdminVenueDashboardComponent } from "../admin-venue-dashboard/admin-venue-dashboard.component";
import { AdminConcertDashboardComponent } from "../admin-concert-dashboard/admin-concert-dashboard.component";

@Component({
  selector: "app-admin-dashboard-component",
  standalone: true,
  imports: [
    CommonModule,
    AdminUserDashboardComponent,
    AdminArtistDashboardComponent,
    AdminCategoryDashboardComponent,
    AdminVenueDashboardComponent,
    AdminConcertDashboardComponent,
  ],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponentComponent implements OnInit {
  view = "";

  constructor() {}

  ngOnInit(): void {
    this.view = "users";
  }

  changeView(view: string): void {
    this.view = view;
  }
}
