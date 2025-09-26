import { Component, OnInit, Input, EventEmitter } from "@angular/core";
import { Concert } from "../../core/models";
import { ConcertService } from "../../core/services";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card-info-concert",
  templateUrl: "./card-info-concert.component.html",
  styleUrls: ["./card-info-concert.component.css"],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CardInfoConcertComponent implements OnInit {
  slug: string;
  concert: Concert;
  page!: String;
  isLoading = true;
  errorMessage = "";

  constructor(private concertService: ConcertService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.slug) {
      this.errorMessage = "Ha habido un error al seleccionar el concierto";
    }
    this.slug = this.route.snapshot.params["slug"];
    this.loadConcertInfo(this.slug);
  }

  loadConcertInfo(slug): void {
    this.isLoading = true;
    this.concertService.get_concert(slug).subscribe((data: any) => {
      this.concert = data;
      this.isLoading = false;
    });
  }
}
