import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Profile } from "../models";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private _profile = signal<Profile | null>(null);
  profile = this._profile.asReadonly();
  constructor(private apiService: ApiService) {}

  get(username: string): Observable<Profile> {
    return this.apiService.get(user_port, `/profile/${username}`).pipe(
      map((data: { profile: Profile }) => data.profile),
      tap((profile: Profile) => {
        this._profile.set(profile);
      })
    );
  }

  followUserFromProfile(username: string): Observable<Profile> {
    return this.apiService.post(user_port, `/user/follow/${username}`, undefined).pipe(
      map((data: any) => {
        if (data.result === true && data.message === "Followed user successfully") {
          if (this._profile()) {
            this._profile.set({
              ...this._profile()!,
              following: true,
            });
          }
        } else if (data.result === true && data.message === "Unfollowed user successfully") {
          if (this._profile()) {
            this._profile.set({
              ...this._profile()!,
              following: false,
            });
          }
        } else {
          console.log("Error:", data);
        }
        return data.user as Profile;
      })
    );
  }
}
