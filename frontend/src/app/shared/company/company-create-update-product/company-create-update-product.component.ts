import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserCompanyService } from "src/app/core/services";
import { Product } from "src/app/core/models";

@Component({
  selector: "app-company-create-update-product",
  templateUrl: "./company-create-update-product.component.html",
  styleUrls: ["./company-create-update-product.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CompanyCreateUpdateProductComponent implements OnInit, OnChanges {
  @Input() product?: Product;
  @Output() changeView = new EventEmitter<string>();
  categories = this.userCompanyService.productCategories;
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private userCompanyService: UserCompanyService) {}

  ngOnInit(): void {
    this.userCompanyService.getAllProductCategories().subscribe(() => {
      this.buildForm();
      if (this.product) this.productForm.patchValue(this.product);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["product"] && this.productForm && this.product) {
      Promise.resolve().then(() => {
        this.productForm.patchValue(this.product!);
      });
    }
  }

  private buildForm(): void {
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      productCategory: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockTotal: [0, [Validators.required, Validators.min(0)]],
      stockAvailable: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ["", Validators.required],
    });
  }

  onSubmit(): void {
    const productData: Product = this.productForm.value;
    if (this.product && this.product.slug) {
      this.userCompanyService.updateProduct(this.product.slug, productData).subscribe({
        next: () => {
          this.changeView.emit("listProducts");
        },
        error: (err) => {
          console.error("Error al actualizar producto:", err);
        },
      });
    } else {
      this.userCompanyService.createProduct(productData).subscribe({
        next: () => {
          this.changeView.emit("listProducts");
        },
        error: (err) => {
          console.error("Error al crear producto:", err);
        },
      });
    }
  }
}
