import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class JwtService {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";

  getToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    return token;
  }

  // getToken(): String {
  //   return window.localStorage["access_token"];
  // }

  // getToken(): any {
  //   const jwt = {
  //     access_token: window.localStorage['access_token'],
  //     refresh_token: window.localStorage['refresh_token']
  //   }
  //   return jwt;
  // }

  // saveToken(access_token: String, refresh_token?: String) {
  //   window.localStorage["access_token"] = access_token;
  //   window.localStorage["refresh_token"] = refresh_token;
  // }

  saveToken(access_token: string, refresh_token?: string) {
    if (access_token) localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);
    if (refresh_token) localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh_token);
  }

  destroyToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // destroyToken() {
  //   window.localStorage.removeItem("access_token");
  //   window.localStorage.removeItem("refresh_token");
  // }
}
