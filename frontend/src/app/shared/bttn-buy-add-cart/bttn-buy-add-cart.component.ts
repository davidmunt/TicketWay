import { Component, Input, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { UserService } from "../../core/services/user.service";
import { ProductService } from "../../core/services/product.service";
import { PaymentService } from "../../core/services/payment.service";
import { ProductCategoryService } from "../../core/services/productcategory.service";
import { constructLoginUrlTree } from "src/app/core";
import { CardInfoFormComponent } from "../../shared/card-info-form/card-info-form.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-bttn-buy-add-cart",
  templateUrl: "./bttn-buy-add-cart.component.html",
  styleUrls: ["./bttn-buy-add-cart.component.css"],
  standalone: true,
  imports: [CommonModule, CardInfoFormComponent],
})
export class BttnBuyAddCart implements OnInit {
  @Input() type: "buy" | "data-payment" | "add" = "add";
  @Input() typePayment?: "buyOne" | "buyCart" = "buyCart";

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
  sugestionIsProduct = signal(true);
  productQty = signal(0);

  isLoading = false;
  errorMessage = "";

  cardInfo: any = null;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private paymentService: PaymentService,
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
      if (this.type === "add") {
        this.sugestionIsProduct.set(true);
        this.showSuggestion.set(true);
        return;
      }
      if (this.typePayment === "buyCart") {
        this.sugestionIsProduct.set(false);
        this.showSuggestion.set(true);
        return;
      }
      if (this.type === "buy" && this.typePayment === "buyOne") {
        this.sugestionIsProduct.set(true);
        this.showSuggestion.set(true);
        return;
      }
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

  procesarPago(data: any) {
    this.cardInfo = data;
    this.isLoading = true;
    let products;
    if (this.typePayment === "buyOne") {
      const qty = this.productQty();
      products = [
        {
          concert: this.concertId,
          ticketsQty: this.ticketsQty,
          product: this.productId,
          productQty: qty,
        },
      ];
    } else {
      products = this.cartService.cart().concerts;
    }
    this.paymentService.create_payment(products, this.cardInfo).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuggestion.set(false);
        this.sugestionIsProduct.set(true);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Comment added",
        }).then(() => {
          this.router.navigateByUrl("/home");
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Error al intentar pagar";
      },
    });
  }

  onConfirmBuy(): void {
    this.sugestionIsProduct.set(false);
    this.type = "data-payment";
  }

  closeSuggestion(): void {
    this.showSuggestion.set(false);
  }
}
