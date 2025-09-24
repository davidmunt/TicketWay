import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';

// <reference types="@angular/localize" />

import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { MainComponent } from './app/main/main.component';

// bootstrapApplication(MainComponent, {
//   providers: [
//     provideRouter(appRoutes)
//   ]
// })
//   .catch(err => console.error(err));

bootstrapApplication(MainComponent, appConfig)
  .catch((err) => console.error(err));