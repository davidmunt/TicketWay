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

  saveToken(access_token: string, refresh_token?: string) {
    if (access_token) localStorage.setItem(this.ACCESS_TOKEN_KEY, access_token);
    if (refresh_token) localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh_token);
  }

  destroyToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
