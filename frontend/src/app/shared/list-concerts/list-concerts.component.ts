import { Component, OnInit } from "@angular/core";
import { ConcertService } from "../../core/services/concert.service";
import { Concert } from "../../core/models/concert.model";
import { CommonModule } from "@angular/common";
import { CardConcertComponent } from "../card-concert/card-concert.component";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-concerts-list",
  templateUrl: "./list-concerts.component.html",
  styleUrls: ["./list-concerts.component.css"],
  standalone: true,
  imports: [CommonModule, CardConcertComponent, LucideAngularModule],
})
export class ConcertsListComponent implements OnInit {
  concerts: Concert[] = [];
  isLoading = true;
  errorMessage = "";

  constructor(private concertService: ConcertService) {}

  ngOnInit(): void {
    this.loadConcerts();
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
}
