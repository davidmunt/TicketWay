import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { appRoutes } from "../../app.routes";
import { CategoriesListComponent } from "../../shared/list-categories/list-categories.component";
import { CarouselCategoriesComponent } from "../../shared/carousel-categories/carousel-categories.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: true,
  imports: [RouterModule, CommonModule, CarouselCategoriesComponent, CategoriesListComponent],
})
export class HomeComponent {}
