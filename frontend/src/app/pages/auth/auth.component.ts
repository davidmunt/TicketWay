import { Routes, RouterLink, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { appRoutes } from "../../app.routes";
import { ConcertsListComponent } from "../../shared/list-concerts/list-concerts.component";
import { AuthComponentComponent } from "../../shared/auth/auth.component";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
  standalone: true,
  imports: [RouterModule, CommonModule, AuthComponentComponent],
})
export class AuthComponent {}

const AuthRoutes: Routes = [
  {
    path: "login",
    component: AuthComponent,
    resolve: {},
  },
  {
    path: "register",
    component: AuthComponent,
    resolve: {},
  },
];

export const AuthRoutingModule = RouterModule.forChild(AuthRoutes);
