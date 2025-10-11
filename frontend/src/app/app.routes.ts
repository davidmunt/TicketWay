import { Routes } from "@angular/router";

export const appRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((c) => c.HomeComponent),
  },
  {
    path: "home",
    loadComponent: () => import("./pages/home/home.component").then((c) => c.HomeComponent),
  },
  {
    path: "shop",
    loadChildren: () => import("./pages/shop/shop.routes"),
  },
  {
    path: "details/:slug",
    loadComponent: () => import("./pages/details/details.component").then((c) => c.DetailsComponent),
  },
  {
    path: "auth",
    loadChildren: () => import("./pages/auth/auth.routes"),
  },
];
