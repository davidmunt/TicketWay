import {
  Component,
  Input,
  OnInit,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Category } from "src/app/core/models";
import { UserAdminService } from "src/app/core/services";

@Component({
  selector: "app-admin-create-update-category",
  templateUrl: "./admin-create-update-category.component.html",
  styleUrls: ["./admin-create-update-category.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminCreateUpdateCategoryComponent implements OnInit, OnChanges {
  @Input() category?: Category;
  @Output() changeView = new EventEmitter<string>();
  categoryForm!: FormGroup;

  constructor(private fb: FormBuilder, private userAdminService: UserAdminService) {}

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
      isActive: [true],
      image: [""],
    });
  }

  onSubmit(): void {
    const categoryData: Category = this.categoryForm.value;
    if (this.category && this.category.slug) {
      this.userAdminService.updateCategory(this.category.slug, categoryData).subscribe({
        next: () => {
          this.changeView.emit("listCategories");
        },
        error: (err) => {
          console.error("Error al actualizar categoría:", err);
        },
      });
    } else {
      this.userAdminService.createCategory(categoryData).subscribe({
        next: () => {
          this.changeView.emit("listCategories");
        },
        error: (err) => {
          console.error("Error al crear categoría:", err);
        },
      });
    }
  }
}
