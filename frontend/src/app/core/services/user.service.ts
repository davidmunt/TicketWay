import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, ReplaySubject } from "rxjs";

import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { User } from "../models";
import { map, distinctUntilChanged } from "rxjs/operators";
import { __values } from "tslib";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private jwtService: JwtService) {}

  populate() {
    const token = this.jwtService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      });
      const fullUrl = `${user_port}/user`;
      this.apiService.get(user_port, "/user", { headers }).subscribe({
        next: (data) => {
          return this.setAuth({ ...data.user, token });
        },
        error: (err) => {
          console.error("Error en populate:", err);
          this.purgeAuth();
        },
      });
    } else {
      console.warn("No hay token, purgando auth");
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.currentUser.subscribe((userData) => {}).unsubscribe();
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = type === "login" ? "/login" : "";
    return this.apiService.post(user_port, `/user${route}`, { user: credentials }).pipe(
      map((res: any) => {
        this.setAuth(res.user);
        return res.user;
      })
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  getUserProfile(): Observable<User> {
    return this.apiService.get(user_port, `/profile/${this.currentUserSubject.value.username}`, undefined).pipe(
      map((data: any) => {
        // this.currentUserSubject.next(data.profile);
        return data.profile;
      })
    );
  }

  update(user: User): Observable<User> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    });

    return this.apiService.put(user_port, "/user", { user }, { headers }).pipe(
      map((data) => {
        this.currentUserSubject.next(data.user);
        return data.user;
      })
    );
  }
}
