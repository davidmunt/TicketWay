import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CompanyProductDashboardComponent } from "../company-product-dashboard/company-product-dashboard.component";
import { CompanyProductCategoryDashboardComponent } from "../company-product-category-dashboard/company-product-category-dashboard.component";

@Component({
  selector: "app-admin-dashboard-component",
  standalone: true,
  imports: [CommonModule, CompanyProductDashboardComponent, CompanyProductCategoryDashboardComponent],
  templateUrl: "./company-dashboard.component.html",
  styleUrls: ["./company-dashboard.component.css"],
})
export class CompanyDashboardComponentComponent implements OnInit {
  view = "";

  constructor() {}

  ngOnInit(): void {
    this.view = "products";
  }

  changeView(view: string): void {
    this.view = view;
  }
}
