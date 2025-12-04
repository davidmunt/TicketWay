import { Routes } from "@angular/router";
import { UserTypeGuard } from "./core/guards/user-type-guard.service";

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
  {
    path: "profile",
    loadChildren: () => import("./pages/profile/profile.routing"),
  },
  {
    path: "adminDashboard",
    loadComponent: () => import("./pages/adminDashboard/adminDashboard.component").then((c) => c.AdminDashboardComponent),
    canActivate: [UserTypeGuard],
    data: { expectedUserType: "admin" },
  },
  {
    path: "companyDashboard",
    loadComponent: () => import("./pages/companyDashboard/companyDashboard.component").then((c) => c.CompanyDashboardComponent),
    canActivate: [UserTypeGuard],
    data: { expectedUserType: "company" },
  },
  {
    path: "cart/:slug",
    loadComponent: () => import("./pages/cart/cart.component").then((c) => c.CartComponent),
  },
];
