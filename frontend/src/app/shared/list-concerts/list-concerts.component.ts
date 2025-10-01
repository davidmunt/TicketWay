import { Component, OnInit } from "@angular/core";
import { ConcertService } from "../../core/services/concert.service";
import { Concert } from "../../core/models/concert.model";
import { CommonModule } from "@angular/common";
import { CardConcertComponent } from "../card-concert/card-concert.component";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute } from "@angular/router";
import { offset } from "@popperjs/core";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: "app-concerts-list",
  templateUrl: "./list-concerts.component.html",
  styleUrls: ["./list-concerts.component.css"],
  standalone: true,
  imports: [CommonModule, CardConcertComponent, LucideAngularModule, InfiniteScrollModule],
})
export class ConcertsListComponent implements OnInit {
  concerts: Concert[] = [];
  slug: string | null;
  isLoading = true;
  errorMessage = "";
  offset = 0;
  limit = 6;
  loadedAllConcerts = false;

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
    if (!this.loadedAllConcerts) {
      this.isLoading = true;
      this.errorMessage = "";
      this.concertService.get_concerts(this.offset, this.limit).subscribe({
        next: (data) => {
          if (data.length < this.limit) {
            this.loadedAllConcerts = true;
          }
          console.log(data);
          data.map((concert) => this.concerts.push(concert));
          this.offset += this.limit;
          console.log("si que llega a");
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

  loadConcertsByCategory(slug): void {
    if (!this.loadedAllConcerts) {
      this.isLoading = true;
      this.errorMessage = "";
      this.concertService.get_concerts_by_category(slug, this.offset, this.limit).subscribe({
        next: (data) => {
          if (data.length < this.limit) {
            this.loadedAllConcerts = true;
          }
          data.map((concert) => this.concerts.push(concert));
          this.offset += this.limit;
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

  onScroll(): void {
    if (this.slug) {
      this.loadConcertsByCategory(this.slug);
    } else {
      this.loadConcerts();
    }
  }
}
