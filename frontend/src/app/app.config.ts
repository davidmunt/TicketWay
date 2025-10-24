import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, HttpClientModule, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { HttpTokenInterceptor } from "src/app/core/interceptors/http.token.interceptor";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(appRoutes), provideHttpClient(withInterceptors([HttpTokenInterceptor])), provideAnimations(), provideToastr()],
};
