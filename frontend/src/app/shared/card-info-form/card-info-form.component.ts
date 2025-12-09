import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Card } from "../../core/models/index";

@Component({
  selector: "app-card-info-form",
  templateUrl: "./card-info-form.component.html",
  styleUrls: ["./card-info-form.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CardInfoFormComponent implements OnInit {
  @Output() cardInfoSubmit = new EventEmitter<Card>();
  @Output() changeView = new EventEmitter<string>();

  cardForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.cardForm = this.fb.group({
      numero: ["", [Validators.required, Validators.pattern("^[0-9]{16}$")]],
      cvv: ["", [Validators.required, Validators.pattern("^[0-9]{3,4}$")]],
      fechaCaducidad: ["", [Validators.required, Validators.pattern("^(0[1-9]|1[0-2])\\/([0-9]{2})$")]],
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData: Card = this.cardForm.value;
      this.cardInfoSubmit.emit(cardData);
    } else {
      this.cardForm.markAllAsTouched();
    }
  }
}
