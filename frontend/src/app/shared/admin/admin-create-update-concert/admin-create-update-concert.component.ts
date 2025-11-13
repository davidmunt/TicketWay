import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Concert, Venue, Category, Artist } from "../../../core/models";
import { UserAdminService } from "../../../core/services";

@Component({
  selector: "app-admin-create-update-concert",
  templateUrl: "./admin-create-update-concert.component.html",
  styleUrls: ["./admin-create-update-concert.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminCreateUpdateConcertComponent implements OnInit, OnChanges {
  @Input() concert?: Concert;
  @Output() changeView = new EventEmitter<string>();
  concertForm!: FormGroup;

  venues: Venue[] = [];
  categories: Category[] = [];
  artists: Artist[] = [];

  constructor(private fb: FormBuilder, private userAdminService: UserAdminService) {}
  ngOnInit(): void {
    this.loadData();
    this.buildForm();
    if (this.concert) {
      this.concertForm.patchValue(this.concert);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["concert"] && this.concertForm && this.concert) {
      Promise.resolve().then(() => {
        this.concertForm.patchValue(this.concert!);
      });
    }
  }

  private buildForm(): void {
    this.concertForm = this.fb.group({
      name: ["", Validators.required],
      date: ["", Validators.required],
      venue: ["", Validators.required],
      description: [""],
      category: ["", Validators.required],
      artist: ["", Validators.required],
      images: this.fb.array([this.fb.control("")]),
      price: [0, Validators.min(0)],
      availableSeats: [0, Validators.min(0)],
      status: ["PENDING", Validators.required],
      isActive: [true],
    });
  }

  get imageControls(): FormControl[] {
    return (this.concertForm.get("images") as FormArray).controls as FormControl[];
  }

  addImage(): void {
    (this.concertForm.get("images") as FormArray).push(this.fb.control(""));
  }

  onArtistSelect(event: Event): void {
    const radio = event.target as HTMLInputElement;
    const artistId = radio.value;
    this.concertForm.get("artist")?.setValue(artistId);
  }

  removeImage(index: number): void {
    (this.concertForm.get("images") as FormArray).removeAt(index);
  }

  loadData() {
    this.userAdminService.getAllVenues().subscribe((v) => (this.venues = v));
    this.userAdminService.getAllCategories().subscribe((c) => (this.categories = c));
    this.userAdminService.getAllArtists().subscribe((a) => (this.artists = a));
  }

  onSubmit(): void {
    const concertData: Concert = this.concertForm.value;
    if (this.concert && this.concert.slug) {
      this.userAdminService.updateConcert(this.concert.slug, concertData).subscribe({
        next: () => {
          this.changeView.emit("listConcerts");
        },
        error: (err) => {
          console.error("Error al actualizar concierto:", err);
        },
      });
    } else {
      this.userAdminService.createConcert(concertData).subscribe({
        next: () => {
          this.changeView.emit("listConcerts");
        },
        error: (err) => {
          console.error("Error al crear concierto:", err);
        },
      });
    }
  }
}
