import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { appRoutes } from "../../app.routes";
import { ConcertsListComponent } from "../../shared/list-concerts/list-concerts.component";

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.css"],
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, ConcertsListComponent],
})
export class ShopComponent {}
