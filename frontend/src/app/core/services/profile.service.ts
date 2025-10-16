import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Profile } from "../models";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ProfilesService {
  constructor(private apiService: ApiService) {}

  get(username: string): Observable<Profile> {
    let res = this.apiService.get(user_port, "/profile/" + username).pipe(map((data: { profile: Profile }) => data.profile));
    return res;
  }
}
