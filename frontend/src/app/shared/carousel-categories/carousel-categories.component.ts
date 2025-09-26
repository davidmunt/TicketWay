import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from "@angular/core";
import { CarouselHome } from "../../core/models";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CarouselService } from "src/app/core/services";

@Component({
  selector: "app-carousel-categories",
  templateUrl: "./carousel-categories.component.html",
  styleUrls: ["./carousel-categories.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CarouselCategoriesComponent implements OnInit {
  categories: CarouselHome[] = [];
  isLoading = true;
  errorMessage = "";

  title = "swiper-elements";

  constructor(private carouselService: CarouselService) {}

  ngOnInit(): void {
    this.loadCarousel();
  }

  loadCarousel(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.carouselService.get_carousel_categories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = "Ha habido un error al cargar el carousel de Categorias";
        this.isLoading = false;
      },
    });
  }
}
