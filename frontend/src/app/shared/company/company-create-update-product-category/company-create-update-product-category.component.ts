import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserCompanyService } from "src/app/core/services";
import { ProductCategory } from "src/app/core/models";

@Component({
  selector: "app-company-create-update-product-category",
  templateUrl: "./company-create-update-product-category.component.html",
  styleUrls: ["./company-create-update-product-category.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CompanyCreateUpdateProductCategoryComponent implements OnInit, OnChanges {
  @Input() category?: ProductCategory | null = null;
  @Output() changeView = new EventEmitter<string>();

  categoryForm!: FormGroup;

  constructor(private fb: FormBuilder, private userCompanyService: UserCompanyService) {}

  // ngOnInit(): void {
  //   this.buildForm();
  //   console.log("Categoria: ", this.category);
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["category"]) {
  //     this.rebuildForm();
  //   }
  // }

  ngOnInit(): void {
    this.buildForm();
    if (this.category) {
      this.categoryForm.patchValue(this.category);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["category"] && this.categoryForm && this.category) {
      Promise.resolve().then(() => {
        this.categoryForm.patchValue(this.category!);
      });
    }
  }

  private buildForm(): void {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      image: ["", Validators.required],
    });
  }

  private rebuildForm(): void {
    this.buildForm();
    if (this.category) {
      console.log("reconstruyendo categoria: ", this.category);
      this.categoryForm.patchValue({
        name: this.category.name,
        description: this.category.description,
        image: this.category.image,
      });
    } else {
      this.categoryForm.reset({
        name: "",
        description: "",
        image: "",
      });
    }
  }

  onSubmit(): void {
    const categoryData: ProductCategory = this.categoryForm.value;
    if (this.category && this.category.slug) {
      this.userCompanyService.updateProductCategory(this.category.slug, categoryData).subscribe({
        next: () => {
          this.changeView.emit("listProductCategories");
        },
        error: (err) => {
          console.error("Error al actualizar categoria:", err);
        },
      });
    } else {
      this.userCompanyService.createProductCategory(categoryData).subscribe({
        next: () => {
          this.changeView.emit("listProductCategories");
        },
        error: (err) => {
          console.error("Error al crear categoria:", err);
        },
      });
    }
  }
}
