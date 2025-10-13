import { Route } from "@angular/router";
import { ProfileResolver } from "../../core";

export default [
  {
    path: ":username",
    loadComponent: () => import("./profile.component").then((c) => c.ProfileComponent),
    resolve: { profile: ProfileResolver },
  },
] as Route[];
