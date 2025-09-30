import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from "@angular/core";
import { CarouselDetails, CarouselHome } from "../../core/models";
import { ActivatedRoute, RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CarouselService } from "src/app/core/services";
import { CarouselItemsComponent } from "../carousel-items/carousel-items.component";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, CarouselItemsComponent],
})
export class CarouselComponent implements OnInit {
  items_carousel!: CarouselHome[];
  items_details!: CarouselDetails[];
  slug_details!: string;
  page!: String;
  isLoading = true;
  errorMessage = "";
  title = "swiper-elements";

  constructor(private carouselService: CarouselService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug_details = this.route.snapshot.params["slug"];
    this.loadCarouselData();
  }

  loadCarouselData(): void {
    this.isLoading = true;
    this.errorMessage = "";
    if (this.slug_details) {
      this.page = "details";
      this.carouselService.get_carousel_concert(this.slug_details).subscribe((data: any) => {
        this.items_details = data.images;
        // console.log(this.items_details);
      });
    } else {
      this.page = "categories";
      this.carouselService.get_carousel_categories().subscribe((data: any) => {
        // console.log(data);
        this.items_carousel = data;
      });
    }
  }
}
