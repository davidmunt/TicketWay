import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserAdminService } from "src/app/core/services";
import { Artist } from "src/app/core/models";

@Component({
  selector: "app-admin-create-update-artist",
  templateUrl: "./admin-create-update-artist.component.html",
  styleUrls: ["./admin-create-update-artist.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminCreateUpdateArtistComponent implements OnInit, OnChanges {
  @Input() artist?: Artist;
  @Output() changeView = new EventEmitter<string>();
  categories = this.userAdminService.categories;
  artistForm!: FormGroup;

  constructor(private fb: FormBuilder, private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.userAdminService.getAllCategories().subscribe(() => {
      this.buildForm();
      if (this.artist) this.artistForm.patchValue(this.artist);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["artist"] && this.artistForm && this.artist) {
      Promise.resolve().then(() => {
        this.artistForm.patchValue(this.artist!);
      });
    }
  }

  private buildForm(): void {
    this.artistForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      nationality: [""],
      images: this.fb.array([this.fb.control("")]),
      categories: [[]],
      isActive: [true],
    });
  }

  get imageControls(): FormControl[] {
    return (this.artistForm.get("images") as FormArray).controls as FormControl[];
  }

  addImage(): void {
    (this.artistForm.get("images") as FormArray).push(this.fb.control(""));
  }

  removeImage(index: number): void {
    (this.artistForm.get("images") as FormArray).removeAt(index);
  }

  onCategoryChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const categoryId = checkbox.value;
    if (!categoryId) return;
    const selected = this.artistForm.get("categories")?.value || [];
    if (checkbox.checked) {
      if (!selected.includes(categoryId)) selected.push(categoryId);
    } else {
      const index = selected.indexOf(categoryId);
      if (index > -1) selected.splice(index, 1);
    }
    this.artistForm.get("categories")?.setValue(selected);
  }

  onSubmit(): void {
    const artistData: Artist = this.artistForm.value;
    if (this.artist && this.artist.slug) {
      this.userAdminService.updateArtist(this.artist.slug, artistData).subscribe({
        next: () => {
          this.changeView.emit("listArtists");
        },
        error: (err) => {
          console.error("Error al actualizar artista:", err);
        },
      });
    } else {
      this.userAdminService.createArtist(artistData).subscribe({
        next: () => {
          this.changeView.emit("listArtists");
        },
        error: (err) => {
          console.error("Error al crear artista:", err);
        },
      });
    }
  }
}
