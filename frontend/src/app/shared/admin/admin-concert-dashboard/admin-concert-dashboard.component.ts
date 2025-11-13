import { Component, OnInit } from "@angular/core";
import { UserAdminService } from "../../../core/services";
import { CommonModule, DatePipe } from "@angular/common";
import { Concert, Venue, Category, Artist } from "../../../core/models";
import { AdminCreateUpdateConcertComponent } from "../admin-create-update-concert/admin-create-update-concert.component";

@Component({
  selector: "app-admin-concert-dashboard",
  templateUrl: "./admin-concert-dashboard.component.html",
  styleUrls: ["./admin-concert-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, DatePipe, AdminCreateUpdateConcertComponent],
})
export class AdminConcertDashboardComponent implements OnInit {
  concerts = this.userAdminService.concerts;
  artists = this.userAdminService.atrists;
  categories = this.userAdminService.categories;
  venues = this.userAdminService.venues;
  view = "";
  concert: Concert | null = null;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.view = "listConcerts";
    this.loadConcerts();
    this.loadVenues();
    this.loadCategories();
    this.loadArtists();
  }

  loadConcerts() {
    this.userAdminService.getAllConcerts().subscribe();
  }

  loadVenues() {
    this.userAdminService.getAllVenues().subscribe();
  }

  loadCategories() {
    this.userAdminService.getAllCategories().subscribe();
  }

  loadArtists() {
    this.userAdminService.getAllArtists().subscribe();
  }

  getVenueName(id: string): string {
    const venues = this.venues(); // leemos el valor actual del signal
    return venues?.find((v) => v.venue_id === id)?.name || "Desconocido";
  }

  getCategoryName(id: string): string {
    const categories = this.categories(); // leemos el valor del signal
    return categories?.find((c) => c.category_id === id)?.name || "Desconocida";
  }

  getArtistName(id: string): string {
    const artists = this.artists(); // leemos el valor del signal
    return artists?.find((a) => a.artist_id === id)?.name || "Desconocido";
  }

  changeView(view: string, concert: Concert | null) {
    this.view = view;
    this.concert = concert;
  }

  onDeleteConcert(slug: string) {
    this.userAdminService.deleteConcert(slug).subscribe();
  }
}
