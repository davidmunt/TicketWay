import { Component, OnInit, Input } from "@angular/core";
import { UserAdminService } from "../../../core/services";
import { CommonModule } from "@angular/common";
import { Artist, Errors } from "src/app/core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AdminCreateUpdateArtistComponent } from "../admin-create-update-artist/admin-create-update-artist.component";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Component({
  selector: "app-admin-artist-dashboard",
  templateUrl: "./admin-artist-dashboard.component.html",
  styleUrls: ["./admin-artist-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminCreateUpdateArtistComponent],
})
export class AdminArtistDashboardComponent implements OnInit {
  artists = this.userAdminService.atrists;
  categories = this.userAdminService.categories;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  view = "";
  artist: Artist | null = null;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.view = "listArtists";
    this.userAdminService.getAllArtists().subscribe();
    this.userAdminService.getAllCategories().subscribe();
  }

  getCategoryName(id: string): string {
    console.log(id);
    console.log(this.categories());
    const categories = this.categories();
    return categories?.find((c) => c.category_id === id)?.name || "Desconocida";
  }

  changeView(view: string, artist: Artist | null): void {
    this.view = view;
    this.artist = view === "createUpdateArtist" ? artist : null;
  }

  onDeleteArtist(slug: string): void {
    this.userAdminService.deleteArtist(slug).subscribe();
  }
}
