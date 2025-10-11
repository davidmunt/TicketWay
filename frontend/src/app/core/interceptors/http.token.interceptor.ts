import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { JwtService } from "../services";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    // const headersConfig: { [key: string]: string } = {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json'
    // };

    console.log(`ENTRA EN EL INTERCEPTOR`);
    const token = this.jwtService.getToken();
    // console.log(token);

    if (token) {
      headersConfig["Authorization"] = `Token ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
