import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";
import { CarouselDetails, CarouselHome } from "../../core/models/carousel.model";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-carousel-items",
  templateUrl: "./carousel-items.component.html",
  styleUrl: "./carousel-items.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CarouselItemsComponent implements OnInit {
  @Input() categories!: CarouselHome[];
  @Input() jobs_details!: CarouselDetails[];
  @Input() page!: String;

  constructor() {}

  ngOnInit(): void {
    if (this.page === "home") {
      console.log("llefa aqui");
      console.log(this.categories);
    }
    if (this.page === "details") {
      console.log("llefa aqui");
      console.log(this.jobs_details);
    }
  }
}
