import { Component, OnInit, effect } from "@angular/core";
import { CartService } from "../../core/services/cart.service";
import { UserService } from "../../core/services/user.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { constructLoginUrlTree } from "src/app/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-cart-list",
  templateUrl: "./list-cart.component.html",
  styleUrls: ["./list-cart.component.css"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class CartListComponent implements OnInit {
  slug!: string;
  isLoading = false;
  errorMessage = "";
  cart = this.cartService.cart;
  currentUser = this.userService.currentUser;
  isAuthenticated = this.userService.isAuthenticated;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params["slug"];
    this.userService.isAuthenticated.subscribe((auth) => {
      if (!auth) {
        this.router.navigateByUrl(constructLoginUrlTree(this.router));
        return;
      }
      this.getCart();
    });
  }

  getCart(): void {
    if (this.slug) {
      this.cartService.get_cart_from_user(this.slug).subscribe();
    }
  }

  formatPrice(value: number | undefined): string {
    return (value ?? 0).toFixed(2);
  }

  getImageUrl(imagePath: string): string {
    return `assets/imgs/concerts/${imagePath}`;
  }

  decreaseTicket(concertId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.update_concert_cart_qty(currentCart.slug, concertId, "-").subscribe();
  }

  increaseTicket(concertId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.update_concert_cart_qty(currentCart.slug, concertId, "+").subscribe();
  }

  deleteTicket(concertId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.delete_concert_from_cart(currentCart.slug, concertId).subscribe();
  }

  decreaseProduct(productId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.update_product_cart_qty(currentCart.slug, productId, "-").subscribe();
  }

  increaseProduct(productId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.update_product_cart_qty(currentCart.slug, productId, "+").subscribe();
  }

  deleteProduct(productId: string, concertId: string) {
    const currentCart = this.cart();
    if (!currentCart) return;
    this.cartService.delete_product_from_cart(currentCart.slug, productId, concertId).subscribe();
  }
}
