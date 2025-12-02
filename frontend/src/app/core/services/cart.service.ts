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
    productId: string,
    productQty: number
  ): Observable<any> {
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
                ticketsQty,
                product: productId,
                productQty,
              },
            ];
            this._cart.set({
              ...currentCart,
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
          slug: response.slug,
          owner: response.owner,
          isActive: response.isActive,
          status: response.status,
          concerts: (response.concerts || []).map((c: any) => ({
            concert: c.concert,
            ticketsQty: c.ticketsQty,
            product: c.product,
            productQty: c.productQty,
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
          this._cart.set({
            ...currentCart,
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido eliminar el concierto del carrito");
        }
      })
    );
  }

  delete_product_from_cart(slug: string, productId: string): Observable<any> {
    return this.apiService.delete(user_port, `/cart/${slug}/product/${productId}`).pipe(
      tap((response: any) => {
        if (response?.updated === true) {
          const currentCart = this._cart();
          if (!currentCart) return;
          const updatedConcerts = currentCart.concerts.map((c) => {
            if (c.product === productId) {
              return {
                ...c,
                productQty: 0,
              };
            }
            return c;
          });
          this._cart.set({
            ...currentCart,
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
        if (response?.updated === true && response?.error === null) {
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
                ticketsQty: newQty,
              };
            }
            return c;
          });
          this._cart.set({
            ...currentCart,
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido actualizar la cantidad del concierto");
        }
      })
    );
  }

  update_product_cart_qty(slug: string, productId: string, symbol: "+" | "-"): Observable<any> {
    return this.apiService.patch(user_port, `/cart/${slug}/concert/${productId}`, { symbol }).pipe(
      tap((response: any) => {
        if (response?.updated === true && response?.error === null) {
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
                productQty: newQty,
              };
            }
            return c;
          });
          this._cart.set({
            ...currentCart,
            concerts: updatedConcerts,
          });
        } else {
          throw new Error("No se ha podido actualizar la cantidad del concierto");
        }
      })
    );
  }
}
