import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Venue } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class VenueService {
  constructor(private apiService: ApiService) {}

  get_venues(): Observable<Venue[]> {
    return this.apiService.get(user_port, `/venues/`);
  }

  get_venue(slug: String): Observable<Venue> {
    return this.apiService.get(user_port, `/venues/${slug}`);
  }
}
