import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { JwtService } from "../services";

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(private jwtService: JwtService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const headersConfig = {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     };
//     const token = this.jwtService.getToken();
//     if (token) {
//       headersConfig["Authorization"] = `Token ${token}`;
//     }
//     const request = req.clone({ setHeaders: headersConfig });
//     return next.handle(request);
//   }
// }

export const HttpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();

  let headersConfig: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    console.log("🔐 Interceptor activado, token enviado:", token);
    headersConfig["Authorization"] = `Token ${token}`;
  }

  const clonedRequest = req.clone({ setHeaders: headersConfig });
  return next(clonedRequest);
};
