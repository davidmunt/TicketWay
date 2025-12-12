import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Payment, Card } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private _payment = signal<Payment | null>(null);
  payment = this._payment.asReadonly();
  constructor(private apiService: ApiService) {}

  create_payment(products: any, typePayment: string): Observable<any> {
    return this.apiService.post(user_port, `/payment/`, { payment: { products, typePayment } }).pipe(
      map((response: any) => {
        const mapped: Payment = {
          success: response.success,
          paymentIntentId: response.paymentIntentId,
          clientSecret: response.clientSecret,
          orderId: response.orderId,
        };
        return mapped;
      }),
      tap((payment: Payment) => {
        this._payment.set(payment);
      })
    );
  }
}
