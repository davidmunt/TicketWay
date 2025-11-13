import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { JwtService } from "../../core";
import { map, catchError } from "rxjs/operators";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class UserTypeGuard implements CanActivate {
  constructor(private router: Router, private jwtService: JwtService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const token = this.jwtService.getToken();
    const expectedUserType = route.data["expectedUserType"];

    if (!token) {
      console.warn("No hay token");
      return of(this.router.createUrlTree(["/login"]));
    }

    try {
      const decoded: any = jwtDecode(token);
      const userType = decoded.typeUser;

      if (userType === expectedUserType) {
        return of(true);
      } else {
        console.warn(`El usuario tipo: ${userType} no puede entrar a esta ruta`);
        return of(this.router.createUrlTree(["/"]));
      }
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return of(this.router.createUrlTree(["/login"]));
    }
  }
}
