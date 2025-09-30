import { Route } from "@angular/router";
import { ShopComponent } from "./shop.component";

export default [
  {
    path: "",
    loadComponent: () => import("./shop.component").then((c) => c.ShopComponent),
  },
  {
    path: "categories/:slug",
    loadComponent: () => import("./shop.component").then((c) => c.ShopComponent),
  },
] as Route[];
