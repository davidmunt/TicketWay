import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { UserService } from "../../core/services/user.service";
import { ProductService } from "../../core/services/product.service";
import { ProductCategoryService } from "../../core/services/productcategory.service";
import { constructLoginUrlTree } from "src/app/core";

@Component({
  selector: "app-bttn-buy-add-cart",
  templateUrl: "./bttn-buy-add-cart.component.html",
  styleUrls: ["./bttn-buy-add-cart.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class BttnBuyAddCart implements OnInit {
  @Input() type: "buy" | "add" = "add";

  @Input() concertId!: string;
  @Input() ticketsQty!: number;
  @Input() concertPricePerTicket!: number;
  @Input() concertSubtotal!: number;
  @Input() productId!: string;

  @Input() concertName!: string;
  @Input() concertImage!: string;

  slug = "";
  product = this.productService.product;
  category = this.categoryService.productCategory;

  showSuggestion = signal(false);
  productQty = signal(0);

  isLoading = false;
  errorMessage = "";

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.userService.currentUser.subscribe((user) => {
      if (user && user.cartSlug) this.slug = user.cartSlug;
    });
    this.productService.get_product(this.productId).subscribe(() => {
      this.categoryService.get_product_category(this.product().productCategory).subscribe();
    });
  }

  onMainButtonClick(): void {
    this.userService.isAuthenticated.subscribe((auth) => {
      if (!auth) {
        this.router.navigateByUrl(constructLoginUrlTree(this.router));
        return;
      }
      this.showSuggestion.set(true);
    });
  }

  onConfirmAdd(): void {
    const qty = this.productQty();
    this.isLoading = true;
    this.cartService
      .add_concert_and_product_to_cart(
        this.slug,
        this.concertId,
        this.ticketsQty,
        this.concertPricePerTicket,
        this.concertPricePerTicket * this.ticketsQty,
        this.productId,
        qty,
        this.product().price,
        qty * this.product().price,
        this.concertName,
        this.concertImage,
        this.product().name,
        this.product().imageUrl
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuggestion.set(false);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = "Error al añadir al carrito";
        },
      });
  }

  //boton pagar
  onConfirmBuy(): void {
    const qty = this.productQty();
    console.log("BUY preparado → tickets + producto:", {
      concertId: this.concertId,
      productQty: qty,
    });
  }

  closeSuggestion(): void {
    this.showSuggestion.set(false);
  }
}
