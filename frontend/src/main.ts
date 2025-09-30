import { register as registerSwiperElements } from "swiper/element/bundle";

import { appConfig } from "./app/app.config";
import { bootstrapApplication } from "@angular/platform-browser";
import { MainComponent } from "./app/main/main.component";

registerSwiperElements();
bootstrapApplication(MainComponent, appConfig).catch((err) => console.error(err));
