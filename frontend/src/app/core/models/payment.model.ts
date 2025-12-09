export interface Payment {
  success: boolean;
  paymentIntentId: string;
  clientSecret: string;
  orderId: string;
}
