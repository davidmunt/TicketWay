import { Component, OnInit } from "@angular/core";
import { ConcertService } from "../../core/services";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { constructLoginUrlTree } from "../../core/guards/auth-guard.service";
import { CommentConcertComponent } from "../comment-concert/comment-concert.component";
import { BttnBuyAddCart } from "../../shared/bttn-buy-add-cart/bttn-buy-add-cart.component";
import { SelectorQuantityComponent } from "../../shared/selector-quantity/selector-quantity.component";

@Component({
  selector: "app-card-info-concert",
  standalone: true,
  imports: [CommonModule, CommentConcertComponent, BttnBuyAddCart, SelectorQuantityComponent],
  templateUrl: "./card-info-concert.component.html",
  styleUrls: ["./card-info-concert.component.css"],
})
export class CardInfoConcertComponent implements OnInit {
  concert = this.concertService.concert;
  slug!: string;
  ticketQtySelected: number = 1;
  isOpen = false;

  constructor(private concertService: ConcertService, private route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params["slug"];
    this.concertService.get_concert(this.slug).subscribe((c) => {
      console.log("concert: ", c);
    });
  }

  onTicketQtyChange(qty: number) {
    this.ticketQtySelected = qty;
  }

  toggleFavourite(slug: string, favorited: boolean): void {
    if (favorited) {
      this.concertService.unfavourite_concert(slug).subscribe({
        error: () => {
          console.error("❌ Error al quitar favorito");
          this.router.navigateByUrl(constructLoginUrlTree(this.router));
        },
      });
    } else {
      this.concertService.favourite_concert(slug).subscribe({
        error: () => {
          console.error("❌ Error al marcar favorito");
          this.router.navigateByUrl(constructLoginUrlTree(this.router));
        },
      });
    }
  }
}
