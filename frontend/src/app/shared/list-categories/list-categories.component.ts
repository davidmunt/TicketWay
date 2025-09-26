import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../core/services/category.service";
import { Category } from "../../core/models/category.model";
import { CommonModule } from "@angular/common";
import { CardCategoryComponent } from "../card-category/card-category.component";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-categories-list",
  templateUrl: "./list-categories.component.html",
  styleUrls: ["./list-categories.component.css"],
  standalone: true,
  imports: [CommonModule, CardCategoryComponent, LucideAngularModule],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  errorMessage = "";

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.categoryService.get_categories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = "Ha habido un erro al cargar las categorias";
        this.isLoading = false;
      },
    });
  }
}
