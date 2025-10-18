import { Injectable } from "@angular/core";
import { environment } from "../../../environments/evironment";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

const URL = environment.api_url;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(port: string, path: string, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<any> {
    console.log(`${URL}${port}${path}`);
    return this.http.get(`${URL}${port}${path}`, options).pipe(catchError(this.formatErrors));
  }

  post(port: string, path: string, body?: any, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<any> {
    return this.http.post(`${URL}${port}${path}`, body, options).pipe(catchError(this.formatErrors));
  }

  put(port: string, path: string, body: any, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<any> {
    return this.http.put(`${URL}${port}${path}`, body, options).pipe(catchError(this.formatErrors));
  }

  delete(port: string, path: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<any> {
    return this.http.delete(`${URL}${port}${path}`, options).pipe(catchError(this.formatErrors));
  }
}
