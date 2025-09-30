import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CarouselComponent } from "../../shared/carousel/carousel.component";
import { CardInfoConcertComponent } from "../../shared/card-info-concert/card-info-concert.component";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"],
  standalone: true,
  imports: [RouterModule, CommonModule, CardInfoConcertComponent, CarouselComponent],
})
export class DetailsComponent {}
