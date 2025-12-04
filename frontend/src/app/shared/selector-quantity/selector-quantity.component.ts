import { Component, Input, Output, EventEmitter, signal } from "@angular/core";

@Component({
  selector: "app-ticket-quantity",
  templateUrl: "./selector-quantity.component.html",
  styleUrls: ["./selector-quantity.component.css"],
  standalone: true,
})
export class SelectorQuantityComponent {
  @Input() maxTickets: number = 10;
  @Output() quantityChange = new EventEmitter<number>();

  quantity = signal(1);

  private emitQuantity() {
    this.quantityChange.emit(this.quantity());
  }

  increase() {
    if (this.quantity() < this.maxTickets) {
      this.quantity.set(this.quantity() + 1);
      this.emitQuantity();
    }
  }

  decrease() {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
      this.emitQuantity();
    }
  }

  onInput(value: string) {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 1;
    num = Math.max(1, Math.min(this.maxTickets, num));
    this.quantity.set(num);
    this.emitQuantity();
  }
}
