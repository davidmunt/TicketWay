import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../../core/services/category.service";
import { Category } from "../../core/models/category.model";
import { CommonModule } from "@angular/common";
import { CardCategoryComponent } from "../card-category/card-category.component";
import { LucideAngularModule } from "lucide-angular";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: "app-categories-list",
  templateUrl: "./list-categories.component.html",
  styleUrls: ["./list-categories.component.css"],
  standalone: true,
  imports: [CommonModule, CardCategoryComponent, LucideAngularModule, InfiniteScrollModule],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = "";
  offset = 0;
  limit = 4;
  allLoaded = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    if (this.allLoaded == false) {
      this.isLoading = true;
      this.errorMessage = "";
      this.categoryService.get_categories(this.offset, this.limit).subscribe({
        next: (data) => {
          if (data.length < this.limit) {
            this.allLoaded = true;
          }
          // console.log(data);
          data.map((category) => this.categories.push(category));
          this.offset += this.limit;
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

  onScroll(): void {
    this.loadCategories();
  }
}
