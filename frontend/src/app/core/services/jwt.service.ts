import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class JwtService {
  getToken(): String {
    return window.localStorage["access_token"];
  }

  // getToken(): any {
  //   const jwt = {
  //     access_token: window.localStorage['access_token'],
  //     refresh_token: window.localStorage['refresh_token']
  //   }
  //   return jwt;
  // }

  saveToken(access_token: String, refresh_token?: String) {
    window.localStorage["access_token"] = access_token;
    window.localStorage["refresh_token"] = refresh_token;
  }

  destroyToken() {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
  }
}
