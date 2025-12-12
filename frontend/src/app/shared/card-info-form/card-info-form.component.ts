import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { loadStripe, Stripe, StripeCardElement } from "@stripe/stripe-js";
import { environment } from "../../../environments/evironment";

@Component({
  selector: "app-card-info-form",
  templateUrl: "./card-info-form.component.html",
  styleUrls: ["./card-info-form.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class CardInfoFormComponent implements OnInit {
  @Output() cardInfoSubmit = new EventEmitter<any>();

  stripe: Stripe | null = null;
  cardElement!: StripeCardElement;
  cardForm!: FormGroup;
  stripeError: string = "";
  loading = false;

  async ngOnInit() {
    this.buildForm();
    await this.setupStripe();
  }

  private buildForm() {
    this.cardForm = this.fb.group({
      name: ["", Validators.required],
    });
  }

  constructor(private fb: FormBuilder) {}

  private async setupStripe() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    const elements = this.stripe!.elements();
    this.cardElement = elements.create("card", {
      hidePostalCode: true,
      style: {
        base: {
          fontSize: "16px",
          color: "#32325d",
          fontFamily: `'Inter', sans-serif`,
          "::placeholder": {
            color: "#a0aec0",
          },
        },
        invalid: {
          color: "#e53e3e",
        },
      },
    });
    this.cardElement.mount("#card-element");
    this.cardElement.on("change", (event) => {
      this.stripeError = event.error ? event.error.message! : "";
    });
  }

  onSubmit() {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.cardInfoSubmit.emit({
      name: this.cardForm.value.name,
      element: this.cardElement,
      stripe: this.stripe,
    });
    this.loading = false;
  }
}
