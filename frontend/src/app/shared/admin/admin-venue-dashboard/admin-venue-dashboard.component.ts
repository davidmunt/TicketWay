import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Venue } from "src/app/core/models";
import { UserAdminService } from "src/app/core/services";
import { AdminCreateUpdateVenueComponent } from "../admin-create-update-venue/admin-create-update-venue.component";

@Component({
  selector: "app-admin-venue-dashboard",
  templateUrl: "./admin-venue-dashboard.component.html",
  styleUrls: ["./admin-venue-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminCreateUpdateVenueComponent],
})
export class AdminVenueDashboardComponent implements OnInit {
  venues = this.userAdminService.venues;
  view = "";
  venue: Venue | null = null;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.view = "listVenues";
    this.loadVenues();
  }

  loadVenues(): void {
    this.userAdminService.getAllVenues().subscribe();
  }

  changeView(view: string, venue?: Venue) {
    this.venue = venue;
    this.view = view;
  }

  onDeleteVenue(slug: string) {
    this.userAdminService.deleteVenue(slug).subscribe(() => this.loadVenues());
  }
}
