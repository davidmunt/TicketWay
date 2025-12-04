import { Component, OnInit, Input } from "@angular/core";
import { UserCompanyService } from "../../../core/services";
import { CommonModule } from "@angular/common";
import { ProductCategory, Errors } from "src/app/core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CompanyCreateUpdateProductCategoryComponent } from "../company-create-update-product-category/company-create-update-product-category.component";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Component({
  selector: "app-company-product-category-dashboard",
  templateUrl: "./company-product-category-dashboard.component.html",
  styleUrls: ["./company-product-category-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CompanyCreateUpdateProductCategoryComponent],
})
export class CompanyProductCategoryDashboardComponent implements OnInit {
  categories = this.userCompanyService.productCategories;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  view = "";
  category: ProductCategory | null = null;

  constructor(private userCompanyService: UserCompanyService) {}

  ngOnInit(): void {
    this.view = "listProductCategories";
    this.userCompanyService.getAllProductCategories().subscribe();
  }

  changeView(view: string, category: ProductCategory | null): void {
    this.view = view;
    this.category = view === "createUpdateProductCategory" ? category : null;
  }

  onDeleteProductCategory(slug: string): void {
    this.userCompanyService.deleteProductCategory(slug).subscribe();
  }
}
