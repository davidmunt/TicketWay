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
  // {
  //   path: "shop",
  //   loadComponent: () => import("./pages/form-concert/form-concert.component").then((c) => c.FormConcertComponent),
  // },
  // {
  //   path: "updateconcert/:slug",
  //   loadComponent: () => import("./pages/form-concert/form-concert.component").then((c) => c.FormConcertComponent),
  // },
];
