import { Component, OnInit, Input } from "@angular/core";
import { UserCompanyService } from "../../../core/services";
import { CommonModule } from "@angular/common";
import { Product, Errors } from "src/app/core/models";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CompanyCreateUpdateProductComponent } from "../company-create-update-product/company-create-update-product.component";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Component({
  selector: "app-company-product-dashboard",
  templateUrl: "./company-product-dashboard.component.html",
  styleUrls: ["./company-product-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CompanyCreateUpdateProductComponent],
})
export class CompanyProductDashboardComponent implements OnInit {
  products = this.userCompanyService.products;
  categories = this.userCompanyService.productCategories;
  errors: Errors = { errors: {} };
  isSubmitting = false;
  view = "";
  product: Product | null = null;

  constructor(private userCompanyService: UserCompanyService) {}

  ngOnInit(): void {
    this.view = "listProducts";
    this.userCompanyService.getAllProducts().subscribe();
    this.userCompanyService.getAllProductCategories().subscribe();
  }

  getCategoryName(id: string): string {
    const categories = this.categories();
    return categories?.find((c) => c.id === id)?.name || "Desconocida";
  }

  changeView(view: string, product: Product | null): void {
    this.view = view;
    this.product = view === "createUpdateProduct" ? product : null;
  }

  onDeleteProduct(slug: string): void {
    this.userCompanyService.deleteProduct(slug).subscribe();
  }
}
