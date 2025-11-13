import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Venue } from "src/app/core/models";
import { UserAdminService } from "src/app/core/services";

@Component({
  selector: "app-admin-create-update-venue",
  templateUrl: "./admin-create-update-venue.component.html",
  styleUrls: ["./admin-create-update-venue.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminCreateUpdateVenueComponent implements OnInit {
  private _venue?: Venue;

  @Input()
  set venue(v: Venue | null | undefined) {
    this._venue = v ?? undefined; // aseguramos undefined si es null

    if (this.venueForm) {
      if (v) {
        this.patchForm(v);
      } else {
        // Si es creación, reseteamos el form a valores por defecto
        this.venueForm.reset({
          name: "",
          description: "",
          direction: "",
          city: "",
          country: "",
          capacity: 0,
          isActive: true,
          status: "OPEN",
        });

        const imagesArray = this.venueForm.get("images") as FormArray;
        imagesArray.clear();
        imagesArray.push(this.fb.control(""));
      }
    }
  }

  get venue(): Venue | undefined {
    return this._venue;
  }

  @Output() changeView = new EventEmitter<string>();
  venueForm!: FormGroup;

  constructor(private fb: FormBuilder, private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.buildForm();

    // Si el input ya tenía valor al inicializar, parchea los datos
    if (this._venue) {
      this.patchForm(this._venue);
    }
  }

  private buildForm(): void {
    this.venueForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      direction: [""],
      city: [""],
      country: [""],
      capacity: [0, Validators.min(0)],
      isActive: [true],
      images: this.fb.array([this.fb.control("")]),
      status: ["OPEN", Validators.required],
    });
  }

  private patchForm(v: Venue): void {
    this.venueForm.patchValue({
      name: v.name,
      description: v.description,
      direction: v.direction,
      city: v.city,
      country: v.country,
      capacity: v.capacity,
      isActive: v.isActive,
      status: v.status,
    });

    const imagesArray = this.venueForm.get("images") as FormArray;
    imagesArray.clear();
    if (v.images?.length) {
      v.images.forEach((img) => imagesArray.push(this.fb.control(img)));
    } else {
      imagesArray.push(this.fb.control(""));
    }
  }

  get imageControls(): FormControl[] {
    return (this.venueForm.get("images") as FormArray).controls as FormControl[];
  }

  addImage(): void {
    (this.venueForm.get("images") as FormArray).push(this.fb.control(""));
  }

  removeImage(index: number): void {
    (this.venueForm.get("images") as FormArray).removeAt(index);
  }

  onSubmit(): void {
    const venueData: Venue = this.venueForm.value;
    if (this._venue && this._venue.slug) {
      this.userAdminService.updateVenue(this._venue.slug, venueData).subscribe({
        next: () => this.changeView.emit("listVenues"),
        error: (err) => console.error("Error al actualizar venue:", err),
      });
    } else {
      this.userAdminService.createVenue(venueData).subscribe({
        next: () => this.changeView.emit("listVenues"),
        error: (err) => console.error("Error al crear venue:", err),
      });
    }
  }
}
