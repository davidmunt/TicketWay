import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { UserAdminService } from "src/app/core/services";
import { Category, Errors } from "src/app/core/models";
import { AdminCreateUpdateCategoryComponent } from "../admin-create-update-category/admin-create-update-category.component";

@Component({
  selector: "app-admin-category-dashboard",
  templateUrl: "./admin-category-dashboard.component.html",
  styleUrls: ["./admin-category-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminCreateUpdateCategoryComponent],
})
export class AdminCategoryDashboardComponent implements OnInit {
  @Input() slug!: string;

  categories = this.userAdminService.categories;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  view = "";
  category: Category | null = null;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.view = "listCategories";
    this.userAdminService.getAllCategories().subscribe();
  }

  changeView(view: string, category: Category | null): void {
    this.view = view;
    this.category = view === "createUpdateCategory" ? category : null;
  }

  onDeleteCategory(slug: string): void {
    this.userAdminService.deleteCategory(slug).subscribe();
  }
}
