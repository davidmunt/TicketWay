import { Component, OnInit } from "@angular/core";
import { ConcertService } from "../../core/services/concert.service";
import { CategoryService } from "../../core/services/category.service";
import { ArtistService } from "../../core/services/artist.service";
import { VenueService } from "../../core/services/venue.service";
import { Concert } from "../../core/models/concert.model";
import { CommonModule, Location } from "@angular/common";
import { CardConcertComponent } from "../card-concert/card-concert.component";
import { FiltersComponent } from "../filters/filters.component";
import { LucideAngularModule } from "lucide-angular";
import { ActivatedRoute } from "@angular/router";
import { Artist, Category, Filters, Venue } from "src/app/core";

@Component({
  selector: "app-concerts-list",
  templateUrl: "./list-concerts.component.html",
  styleUrls: ["./list-concerts.component.css"],
  standalone: true,
  imports: [CommonModule, CardConcertComponent, LucideAngularModule, FiltersComponent],
})
export class ConcertsListComponent implements OnInit {
  concerts: Concert[] = [];
  categories: Category[] = [];
  artists: Artist[] = [];
  venues: Venue[] = [];
  isLoading = true;
  errorMessage = "";
  slug: string | null;
  routeFilters!: string | null;
  filters = new Filters();
  offset: number = 0;
  limit: number = 4;
  totalPages: Array<number> = [];
  currentPage: number = 1;

  constructor(private ConcertService: ConcertService, private route: ActivatedRoute, private CategoryService: CategoryService, private ArtistService: ArtistService, private VenueService: VenueService) {}

  ngOnInit(): void {
    // this.slug = this.route.snapshot.params["slug"];
    this.slug = this.route.snapshot.paramMap.get("slug");
    this.routeFilters = this.route.snapshot.paramMap.get("filters");
    this.filters.limit = this.limit;
    this.filters.offset = this.offset;
    this.getListForCategory();
    this.getListForArtist();
    this.getListForVenue();
    if (this.slug !== null) {
      this.loadConcertsByCategory();
    } else if (this.routeFilters !== null) {
      this.refreshRouteFilter();
      this.get_list_filtered(this.filters);
    } else {
      this.get_list_filtered(this.filters);
    }
  }

  loadConcertsByCategory(): void {
    this.isLoading = true;
    this.errorMessage = "";
    // this.concertService.get_concerts_by_category(this.slug).subscribe({
    //   next: (data) => {
    //     data.map((concert) => this.concerts.push(concert));
    //     this.isLoading = false;
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     this.errorMessage = "Ocurrió un error al cargar los conciertos.";
    //     this.isLoading = false;
    //   },
    // });
    this.ConcertService.get_concerts_by_category(this.slug).subscribe((data: any) => {
      this.concerts = data;
      // this.totalPages = Array.from(new Array(Math.ceil(data.product_count / this.limit)), (val, index) => index + 1);
      console.log(data);
      console.log("conciertos por categoria");
    });
  }

  // get_products_by_cat(): void {
  //   if (this.slug_Category !== null) {
  //     this.productService.getProductsByCategory(this.slug_Category).subscribe((data: any) => {
  //       this.products = data.products;
  //       this.totalPages = Array.from(new Array(Math.ceil(data.product_count / this.limit)), (val, index) => index + 1);
  //       console.log(data.products);
  //       console.log(this.totalPages);
  //     });
  //   }
  // }

  // get_list_filtered(): void {
  //   this.isLoading = true;
  //   this.errorMessage = "";
  //   this.concertService.get_concerts().subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       data.map((concert) => this.concerts.push(concert));
  //       this.isLoading = false;
  //     },
  //     error: (e) => {
  //       console.error(e);
  //       this.errorMessage = "Ocurrió un error al cargar los conciertos.";
  //       this.isLoading = false;
  //     },
  //   });
  // }

  get_list_filtered(filters: Filters) {
    this.filters = filters;
    this.ConcertService.get_concerts_filter(filters).subscribe((data: any) => {
      this.concerts = data.concerts;
      console.log(data.concerts);
      console.log("filtros aplicados");
      this.totalPages = Array.from(new Array(Math.ceil(data.concerts_count / this.limit)), (val, index) => index + 1);
      console.log(data.concerts_count);
    });
  }

  refreshRouteFilter() {
    this.routeFilters = this.route.snapshot.paramMap.get("filters");
    if (typeof this.routeFilters == "string") {
      this.filters = JSON.parse(atob(this.routeFilters));
    } else {
      this.filters = new Filters();
    }
  }

  getListForCategory() {
    this.CategoryService.get_categories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  getListForArtist() {
    this.ArtistService.get_artists().subscribe((data: any) => {
      this.artists = data;
      console.log(this.artists);
    });
  }

  getListForVenue() {
    this.VenueService.get_venues().subscribe((data: any) => {
      this.venues = data;
      console.log(this.venues);
    });
  }

  // setPageTo(pageNumber: number) {
  //   this.currentPage = pageNumber;
  //   if (typeof this.routeFilters === "string") {
  //     this.refreshRouteFilter();
  //   }
  //   if (this.limit) {
  //     this.filters.limit = this.limit;
  //     this.filters.offset = this.limit * (this.currentPage - 1);
  //   }
  //   if (this.currentPage == null || this.currentPage == 1) {
  //     this.Location.replaceState("/shop/");
  //   } else {
  //     this.Location.replaceState("/shop/" + btoa(JSON.stringify(this.filters)));
  //   }
  //   this.get_list_filtered(this.filters);
  //   console.log(`Current page: ${this.currentPage}`);
  // }
}
