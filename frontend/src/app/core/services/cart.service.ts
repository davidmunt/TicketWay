import { Injectable, signal } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Cart, ConcertCart } from "../models";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/evironment";

const user_port = environment.user_port;

@Injectable({
  providedIn: "root",
})
export class CartService {
  private _cart = signal<Cart | null>(null);
  cart = this._cart.asReadonly();
  constructor(private apiService: ApiService) {}

  add_concert_and_product_to_cart(
    slug: string,
    concertId: string,
    ticketsQty: number,
    concertPricePerTicket: number,
    concertSubtotal: number,
    productId: string,
    productQty: number,
    productPricePerUnit: number,
    productSubtotal: number,
    concertName: string,
    concertImage: string,
    productName: string,
    productImage: string
  ): Observable<any> {
    console.log("productId : ", productId);
    return this.apiService
      .post(user_port, `/cart/${slug}`, {
        concert: {
          concertId: concertId,
          ticketsQty: ticketsQty,
          productId: productId,
          productQty: productQty,
        },
      })
      .pipe(
        tap((response: any) => {
          if (response?.created === true) {
            const currentCart = this._cart();
            if (!currentCart) return;
            const updatedConcerts = [
              ...currentCart.concerts,
              {
                concert: concertId,
                ticketsQty: ticketsQty,
                concertName: concertName,
                concertImage: concertImage,
                concertPricePerTicket: concertPricePerTicket,
                concertSubtotal: concertSubtotal,
                product: productId,
                productQty: productQty,
                productName: productName,
                productImage: productImage,
                productPricePerUnit: productPricePerUnit,
                productSubtotal: productSubtotal,
              },
            ];
            this._cart.set({
              ...currentCart,
              totalPrice: concertSubtotal + productSubtotal,
              concerts: updatedConcerts,
            });
          } else {
            throw new Error("No se ha podido eliminar el concierto del carrito");
          }
        })
      );
  }

  get_cart_from_user(slug: string): Observable<Cart> {
    return this.apiService.get(user_port, `/cart/${slug}`).pipe(
      map((response: any) => {
        const mapped: Cart = {
          slug: response.cart.slug,
          owner: response.cart.owner,
          isActive: response.cart.isActive,
          status: response.cart.status,
          totalPrice: response.cart.totalPrice,
          concerts: (response.cart.concerts || []).map((c: any) => ({
            concert: c.concert,
            ticketsQty: c.ticketsQty,
            concertName: c.concertName,
            concertImage: c.concertImage,
            concertPricePerTicket: c.concertPricePerTicket,
            concertSubtotal: c.concertSubtotal,
            product: c.product,
            productQty: c.productQty,
            productName: c.productName,
            productImage: c.productImage,
            productPricePerUnit: c.productPricePerUnit,
            productSubtotal: c.productSubtotal,
          })),
        };
        return mapped;
      }),
      tap((cart: Cart) => {
        this._cart.set(cart);
      })
    );
  }

  delete_concert_from_cart(slug: string, concertId: string): Observable<any> {
    return this.apiService.delete(user_port, `/cart/${slug}/concert/${concertId}`).pipe(
      tap((response: any) => {
        if (response?.updated === true) {
          const currentCart = this._cart();
          if (!currentCart) return;
          const updatedConcerts = currentCart.concerts.filter((c) => c.concert !== concertId);
          const concertToDelete = currentCart.concerts.find((c) => c.concert === concertId);
          if (!concertToDelete) return;
          const concertSubtotal = concertToDelete.concertSubtotal || 0;
          const productSubtotal = concertToDelete.productSubtotal || 0;
          this._cart.set({
            ...currentCart,
            totalPrice: currentCart.totalPrice - (concertSubtotal + productSubtotal),
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido eliminar el concierto del carrito");
        }
      })
    );
  }

  delete_product_from_cart(slug: string, productId: string, concertId: string): Observable<any> {
    return this.apiService.delete(user_port, `/cart/${slug}/product/${productId}`).pipe(
      tap((response: any) => {
        if (response?.updated === true) {
          const currentCart = this._cart();
          if (!currentCart) return;
          const updatedConcerts = currentCart.concerts.map((c) => {
            if (c.concert === concertId) {
              return {
                ...c,
                productQty: 0,
                productSubtotal: 0,
              };
            }
            return c;
          });
          const productToDelete = currentCart.concerts.find((c) => c.product === productId);
          this._cart.set({
            ...currentCart,
            totalPrice: currentCart.totalPrice - productToDelete.productSubtotal,
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido eliminar el concierto del carrito");
        }
      })
    );
  }

  update_concert_cart_qty(slug: string, concertId: string, symbol: "+" | "-"): Observable<any> {
    return this.apiService.patch(user_port, `/cart/${slug}/concert/${concertId}`, { symbol }).pipe(
      tap((response: any) => {
        if (response?.updated === true) {
          const currentCart = this._cart();
          if (!currentCart) return;
          const updatedConcerts = currentCart.concerts.map((c) => {
            if (c.concert === concertId) {
              if (symbol === "-" && c.ticketsQty === 1) {
                new Error("La cantidad de entradas no puede ser menos de 1");
              }
              const newQty = c.ticketsQty + (symbol === "+" ? 1 : -1);
              return {
                ...c,
                concertSubtotal: newQty * c.concertPricePerTicket,
                ticketsQty: newQty,
              };
            }
            return c;
          });
          this._cart.set({
            ...currentCart,
            totalPrice: updatedConcerts.reduce((acc, curr) => acc + curr.concertSubtotal + curr.productSubtotal, 0),
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido actualizar la cantidad del concierto");
        }
      })
    );
  }

  update_product_cart_qty(slug: string, productId: string, symbol: "+" | "-"): Observable<any> {
    return this.apiService.patch(user_port, `/cart/${slug}/product/${productId}`, { symbol }).pipe(
      tap((response: any) => {
        if (response?.updated === true) {
          const currentCart = this._cart();
          if (!currentCart) return;
          const updatedConcerts = currentCart.concerts.map((c) => {
            if (c.product === productId) {
              if (symbol === "-" && c.productQty === 1) {
                new Error("La cantidad de productos no puede ser menos de 1");
              }
              const newQty = c.productQty + (symbol === "+" ? 1 : -1);
              return {
                ...c,
                productSubtotal: newQty * c.productPricePerUnit,
                productQty: newQty,
              };
            }
            return c;
          });
          this._cart.set({
            ...currentCart,
            totalPrice: updatedConcerts.reduce((acc, curr) => acc + curr.concertSubtotal + curr.productSubtotal, 0),
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido actualizar la cantidad del concierto");
        }
      })
    );
  }
}
