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
    // const jwt_access = token.access_token;
    console.log(token);

    if (token) {
      console.log(`sí hay access`);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      });
      console.log(headers);
      this.apiService.get(user_port, "/user", { headers }).subscribe(
        (data) => {
          console.log("entra");
          return this.setAuth({ ...data.user, token });
        },
        // (err) => console.log(err)
        (err) => this.purgeAuth()
      );
    } else {
      console.log(`no hay access`);
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    console.log(user);
    // this.jwtService.saveToken(user.accessToken, user.refreshToken);
    console.log(`intenta guardar token`);
    this.jwtService.saveToken(user.accessToken);
    this.currentUserSubject.next(user);
    this.currentUser.subscribe((userData) => {}).unsubscribe();
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
    console.log("logout");
    console.log(this.getCurrentUser());
    console.log(this.isAuthenticated);
    console.log(this.currentUser);
    console.log("logout");
  }

  // attemptAuth(type: any, credentials: any): Observable<User> {
  //   const route = type === "login" ? "/login" : "";
  //   console.log(credentials);
  //   let response = this.apiService.post(user_port, `/user${route}`, { user: credentials });
  //   console.log(`response`);
  //   response.subscribe((res: any) => {
  //     console.log(res.user);
  //     console.log(`response`);
  //   });
  //   return response;
  // }

  attemptAuth(type: string, credentials: any): Observable<User> {
    const route = type === "login" ? "/login" : "";
    return this.apiService.post(user_port, `/user${route}`, { user: credentials }).pipe(
      map((res: any) => {
        console.log("✅ Login response:", res);
        this.setAuth(res.user); // 👈 AQUÍ guardamos el token y emitimos el usuario
        return res.user;
      })
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
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
