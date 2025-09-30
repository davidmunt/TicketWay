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
  // {
  //   path: "shop",
  //   loadComponent: () => import("./pages/shop/shop.component").then((c) => c.ShopComponent),
  // },
  {
    path: "details/:slug",
    loadComponent: () => import("./pages/details/details.component").then((c) => c.DetailsComponent),
  },
  // {
  //   path: "updateconcert/:slug",
  //   loadComponent: () => import("./pages/form-concert/form-concert.component").then((c) => c.FormConcertComponent),
  // },
];
