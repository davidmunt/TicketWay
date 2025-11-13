import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserTypeService } from "../../core";
import { map, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserTypeGuard implements CanActivate {
  constructor(private router: Router, private userTypeService: UserTypeService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedUserType = route.data["expectedUserType"];

    return this.userTypeService.userType$.pipe(
      take(1),
      map((userType) => {
        if (!userType || userType !== expectedUserType) {
          console.warn(`El usuario tipo: ${userType} no puede entrar a esta ruta`);
          return this.router.createUrlTree(["/"]);
        }
        return true;
      })
    );
  }
}
