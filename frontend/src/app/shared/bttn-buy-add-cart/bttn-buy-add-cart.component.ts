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

  async ngOnInit(): Promise<void> {}

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

  async procesarPago(data: any) {
    this.isLoading = true;
    this.cardInfo = data;
    const stripe = data.stripe;
    if (!stripe) {
      this.errorMessage = "Stripe no está cargado";
      this.isLoading = false;
      return;
    }
    let products;
    let typePayment;
    if (this.typePayment === "buyOne") {
      typePayment = "singleOrder";
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
      typePayment = "cart";
    }
    this.paymentService.create_payment(products, typePayment).subscribe({
      next: async (payment) => {
        const { error, paymentIntent } = await stripe.confirmCardPayment(payment.clientSecret, {
          payment_method: {
            card: this.cardInfo.element,
            billing_details: {
              name: this.cardInfo.name,
            },
          },
        });
        if (error) {
          this.isLoading = false;
          this.errorMessage = error.message || "Error al procesar el pago";
          return;
        }
        if (paymentIntent.status === "succeeded") {
          this.isLoading = false;
          this.showSuggestion.set(false);
          this.sugestionIsProduct.set(true);
          Swal.fire({
            icon: "success",
            title: "Pago completado",
            text: "¡Tu compra se ha realizado con éxito!",
          }).then(() => {
            this.userService.getUserData().subscribe();
            this.router.navigateByUrl("/home");
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Error al iniciar el pago";
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
