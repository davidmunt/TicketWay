import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { UserService } from "../services/user.service";
import { UserAdminService } from "../services/useradmin.service";
import { UserCompanyService } from "../services/usercompany.service";
import { JwtService } from "../services/jwt.service";
import { UserTypeService } from "../services/role.service";

export const HttpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const userService = inject(UserService);
  const userAdminService = inject(UserAdminService);
  const userCompanyService = inject(UserCompanyService);
  const userTypeService = inject(UserTypeService);
  const token = jwtService.getToken();
  const role = userTypeService.getUserType();
  // Añadimos los headers básicos + token si existe
  let headersConfig: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headersConfig["Authorization"] = `Token ${token}`;
  }
  const authReq = req.clone({ setHeaders: headersConfig });
  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.warn("Token expirado o inválido → intentando refresh...");
        if (role === "admin") {
          return userAdminService.refreshToken().pipe(
            switchMap((res: any) => {
              const newToken = res.accessToken || res.token;
              if (newToken) {
                jwtService.saveToken(newToken);
                const newReq = req.clone({
                  setHeaders: { ...headersConfig, Authorization: `Token ${newToken}` },
                });
                return next(newReq);
              } else {
                userAdminService.purgeAuth();
                return throwError(() => err);
              }
            }),
            catchError((refreshErr) => {
              console.error("Error al refrescar token:", refreshErr);
              userAdminService.purgeAuth();
              return throwError(() => refreshErr);
            })
          );
        } else if (role === "company") {
          return userCompanyService.refreshToken().pipe(
            switchMap((res: any) => {
              const newToken = res.accessToken || res.token;
              if (newToken) {
                jwtService.saveToken(newToken);
                const newReq = req.clone({
                  setHeaders: { ...headersConfig, Authorization: `Token ${newToken}` },
                });
                return next(newReq);
              } else {
                userCompanyService.purgeAuth();
                return throwError(() => err);
              }
            }),
            catchError((refreshErr) => {
              console.error("Error al refrescar token:", refreshErr);
              userCompanyService.purgeAuth();
              return throwError(() => refreshErr);
            })
          );
        } else if (role === "user") {
          return userService.refreshToken().pipe(
            switchMap((res: any) => {
              const newToken = res.accessToken || res.token;
              if (newToken) {
                jwtService.saveToken(newToken);
                const newReq = req.clone({
                  setHeaders: { ...headersConfig, Authorization: `Token ${newToken}` },
                });
                return next(newReq);
              } else {
                userService.purgeAuth();
                return throwError(() => err);
              }
            }),
            catchError((refreshErr) => {
              console.error("Error al refrescar token:", refreshErr);
              userService.purgeAuth();
              return throwError(() => refreshErr);
            })
          );
        }
      }
      return throwError(() => err);
    })
  );
};
