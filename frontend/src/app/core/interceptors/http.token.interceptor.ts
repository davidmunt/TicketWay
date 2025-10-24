import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { UserService } from "../services/user.service";
import { JwtService } from "../services/jwt.service";

export const HttpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const userService = inject(UserService);
  const token = jwtService.getToken();
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
      return throwError(() => err);
    })
  );
};

// export const HttpTokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const jwtService = inject(JwtService);
//   const token = jwtService.getToken();

//   let headersConfig: Record<string, string> = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   };

//   if (token) {
//     headersConfig["Authorization"] = `Token ${token}`;
//   }

//   const clonedRequest = req.clone({ setHeaders: headersConfig });
//   return next(clonedRequest);
// };
