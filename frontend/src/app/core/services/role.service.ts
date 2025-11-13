import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { Comment } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";
import { HttpParams } from "@angular/common/http";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class UserTypeService {
  private userTypeSubject = new BehaviorSubject<string | null>(null);
  public userType$: Observable<string | null> = this.userTypeSubject.asObservable();

  constructor(private apiService: ApiService) {
    const savedType = localStorage.getItem("userType");
    if (savedType) {
      this.userTypeSubject.next(savedType);
    }
  }

  getUserTypeRole(credentials: any): Observable<any> {
    return this.apiService
      .post(user_port, `/role/`, { user: credentials }, { withCredentials: true })
      .pipe(
        map((response: any) => response.role),
        tap((role) => {
          this.setUserType(role);
        })
      );
  }

  setUserType(type: string) {
    localStorage.setItem("userType", type);
    this.userTypeSubject.next(type);
  }

  clearUserType() {
    localStorage.removeItem("userType");
    this.userTypeSubject.next(null);
  }

  getUserType(): string | null {
    return this.userTypeSubject.value;
  }
}
