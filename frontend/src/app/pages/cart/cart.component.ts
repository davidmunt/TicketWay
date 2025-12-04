import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CartListComponent } from "../../shared/list-cart/list-cart.component";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
  standalone: true,
  imports: [RouterModule, CommonModule, CartListComponent],
})
export class CartComponent {}
