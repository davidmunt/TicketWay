import { Component, OnInit } from "@angular/core";
import { ConcertService } from "../../core/services/concert.service";
import { Concert } from "../../core/models/concert.model";
import { CommonModule } from "@angular/common";
import { CardConcertComponent } from "../card-concert/card-concert.component";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-concerts-list",
  templateUrl: "./list-concerts.component.html",
  styleUrls: ["./list-concerts.component.css"],
  standalone: true,
  imports: [CommonModule, CardConcertComponent, LucideAngularModule],
})
export class ConcertsListComponent implements OnInit {
  concerts: Concert[] = [];
  slug: string | null;
  isLoading = true;
  errorMessage = "";

  constructor(private concertService: ConcertService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params["slug"];
    if (this.slug) {
      this.loadConcertsByCategory(this.slug);
    } else {
      this.loadConcerts();
    }
  }

  loadConcerts(): void {
    this.isLoading = true;
    this.errorMessage = "";
    this.concertService.get_concerts().subscribe({
      next: (data) => {
        this.concerts = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = "Ocurrió un error al cargar los conciertos.";
        this.isLoading = false;
      },
    });
  }

  loadConcertsByCategory(slug): void {
    this.isLoading = true;
    this.errorMessage = "";
    this.concertService.get_concerts_by_category(slug).subscribe({
      next: (data) => {
        this.concerts = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = "Ocurrió un error al cargar los conciertos.";
        this.isLoading = false;
      },
    });
  }
}
