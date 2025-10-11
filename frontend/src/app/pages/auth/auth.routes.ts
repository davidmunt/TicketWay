import { Route } from "@angular/router";
import { AuthComponent } from "./auth.component";

export default [
  {
    path: "login",
    loadComponent: () => import("./auth.component").then((c) => c.AuthComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./auth.component").then((c) => c.AuthComponent),
  },
] as Route[];
