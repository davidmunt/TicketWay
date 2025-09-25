import { RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { appRoutes } from "../../app.routes";
import { ConcertsListComponent } from "../../shared/list-concerts/list-concerts.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, ConcertsListComponent],
})
export class HomeComponent {}
