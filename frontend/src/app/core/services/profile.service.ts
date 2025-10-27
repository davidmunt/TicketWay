import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { Profile, ProfileFollowers, ProfileConcert } from "../models";
import { map, tap } from "rxjs/operators";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private _profile = signal<Profile | null>(null);
  private _followers = signal<ProfileFollowers[]>([]);
  private _countFollowers = signal<number>(0);
  private _following = signal<ProfileFollowers[]>([]);
  private _countFollowing = signal<number>(0);
  private _favorites = signal<ProfileConcert[]>([]);
  private _countFavourites = signal<number>(0);
  profile = this._profile.asReadonly();
  followers = this._followers.asReadonly();
  countFollowers = this._countFollowers.asReadonly();
  following = this._following.asReadonly();
  countFollowing = this._countFollowing.asReadonly();
  favorites = this._favorites.asReadonly();
  countFavourites = this._countFavourites.asReadonly();
  constructor(private apiService: ApiService) {}

  get(username: string): Observable<Profile> {
    return this.apiService.get(user_port, `/profile/${username}`).pipe(
      map((data: any) => data.profile),
      tap((profile: any) => {
        this._profile.set(profile);
        this._followers.set(profile.usersFollowers || []);
        this._countFollowers.set(profile.countFollowers || 0);
        this._following.set(profile.usersFollowing || []);
        this._countFollowing.set(profile.countFollowing || 0);
        this._favorites.set(profile.favorited || []);
        this._countFavourites.set(profile.favoritesCount || 0);
      })
    );
  }

  followUserFromComponent(username: string, isUser: boolean): Observable<any> {
    return this.apiService.post(user_port, `/user/follow/${username}`, undefined).pipe(
      tap((data: any) => {
        if (data.result === true && data.message === "Followed user successfully") {
          this._followers.update((followers) => followers.map((f) => (f.username === username ? { ...f, following: true } : f)));
          this._following.update((following) => following.map((f) => (f.username === username ? { ...f, following: true } : f)));
          if (isUser) {
            this._countFollowers.update((count) => count + 1);
            this._countFollowing.update((count) => count + 1);
          }
        } else if (data.result === true && data.message === "Unfollowed user successfully") {
          this._followers.update((followers) => followers.map((f) => (f.username === username ? { ...f, following: false } : f)));
          this._following.update((following) => following.map((f) => (f.username === username ? { ...f, following: false } : f)));
          if (isUser) {
            this._followers.update((followers) => followers.filter((f) => f.username !== username));
            this._following.update((following) => following.filter((f) => f.username !== username));
            this._countFollowers.update((count) => Math.max(0, count - 1));
            this._countFollowing.update((count) => Math.max(0, count - 1));
          }
        } else {
          console.log("Error en followUserFromComponent:", data);
        }
      })
    );
  }

  likeConcertFromComponent(slug: string, isUser: boolean): Observable<any> {
    return this.apiService.post(user_port, `/concerts/favorite/${slug}`, undefined).pipe(
      tap((data: any) => {
        if (data.isCompleted === true) {
          this._favorites.update((favorites) => favorites.map((fav) => (fav.slug === slug ? { ...fav, favorited: true } : fav)));
        } else {
          console.log("Error al hacer like:", data);
        }
      })
    );
  }

  unLikeConcertFromComponent(slug: string, isUser: boolean): Observable<any> {
    return this.apiService.delete(user_port, `/concerts/favorite/${slug}`, undefined).pipe(
      tap((data: any) => {
        if (data.isCompleted === true) {
          this._favorites.update((favorites) => favorites.map((fav) => (fav.slug === slug ? { ...fav, favorited: false } : fav)));
          if (isUser) {
            this._favorites.update((favorites) => favorites.filter((fav) => fav.slug !== slug));
            this._countFavourites.update((count) => Math.max(0, count - 1));
          }
        } else {
          console.log("Error al hacer unlike:", data);
        }
      })
    );
  }

  followUserFromProfile(username: string): Observable<Profile> {
    return this.apiService.post(user_port, `/user/follow/${username}`, undefined).pipe(
      map((data: any) => {
        if (data.isCompleted === true) {
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
