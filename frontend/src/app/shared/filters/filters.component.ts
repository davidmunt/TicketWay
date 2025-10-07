import { Component, OnInit, Input, EventEmitter, Output, NgModule } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, Location } from "@angular/common";
import { MatSliderModule } from "@angular/material/slider";

import { Category, Concert, Filters, Artist, Venue } from "src/app/core/models";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule, MatSliderModule],
})
export class FiltersComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() artists: Artist[] = [];
  @Input() venues: Venue[] = [];
  @Output() eventofiltros: EventEmitter<Filters> = new EventEmitter();

  routeFilters: string | null = null;
  filters!: Filters;

  category: string = "";
  artist: string = "";
  venue: string = "";
  price_max: number = 10000;
  price_min: number = 0;

  constructor(private ActivatedRoute: ActivatedRoute, private Router: Router, private Location: Location) {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get("filters");
  }

  ngOnInit(): void {
    this.ActivatedRoute.snapshot.paramMap.get("filters") != undefined ? this.Highlights() : "";
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get("filters");
  }

  public filter_concerts() {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get("filters");
    if (this.routeFilters != null) {
      this.filters = new Filters();
      this.filters = JSON.parse(atob(this.routeFilters));
    } else {
      this.filters = new Filters();
    }
    if (this.category) {
      this.filters.category = this.category;
      // console.log(this.filters.category);
    }
    if (this.artist) {
      this.filters.artist = this.artist;
      // console.log(this.filters.artist);
    }
    if (this.venue) {
      this.filters.venue = this.venue;
      // console.log(this.filters.venue);
    }
    this.price_calc(this.price_min, this.price_max);
    this.filters.price_min = this.price_min ? this.price_min : undefined;
    this.filters.price_max = this.price_max == 0 || this.price_max == null ? undefined : this.price_max;

    setTimeout(() => {
      this.Location.replaceState("/shop/" + btoa(JSON.stringify(this.filters)));
      this.eventofiltros.emit(this.filters);
    }, 200);
  }

  public price_calc(price_min: number | undefined, price_max: number | undefined) {
    if (typeof price_min == "number" && typeof price_max == "number") {
      if (price_min > price_max) {
        this.price_min = price_min;
        this.price_max = undefined;
      } else {
        this.price_min = price_min;
        this.price_max = price_max;
      }
    }
  }

  public remove_filters() {
    window.location.assign("http://localhost:4200/shop");
    this.filters.category && this.category === "";
    this.filters.artist && this.artist === "";
    this.filters.venue && this.venue === "";
    this.filters.price_min = undefined;
    this.filters.price_max = undefined;
  }

  Highlights() {
    let routeFilters = JSON.parse(atob(this.ActivatedRoute.snapshot.paramMap.get("filters") || ""));

    if (routeFilters.search == undefined) {
      this.category = routeFilters.category || "";
      this.artist = routeFilters.artist || "";
      this.venue = routeFilters.venue || "";
      this.price_min = routeFilters.price_min;
      this.price_max = routeFilters.price_max;
    }
  }
}
