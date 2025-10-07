import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Filters, Concert } from "src/app/core/models";
import { ConcertService } from "src/app/core/services/concert.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SearchComponent implements OnInit {
  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  search_value: string | undefined = "";
  concerts: Concert[] = [];
  filters: Filters = new Filters();
  routeFilters!: string | null;
  search: any;

  constructor(private concertService: ConcertService, private Router: Router, private ActivatedRoute: ActivatedRoute, private Location: Location) {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get("filters");
  }

  ngOnInit() {
    if (this.routeFilters !== null) {
      this.filters = JSON.parse(atob(this.routeFilters));
    }
    this.search_value = this.filters.name || undefined;
  }

  public type_event(writtingValue: any): void {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get("filters");
    this.search = writtingValue;
    this.filters.name = writtingValue;

    setTimeout(() => {
      this.searchEvent.emit(this.filters);
      this.Location.replaceState("/shop/" + btoa(JSON.stringify(this.filters)));
      if (this.search.length != 0) {
        this.getConcerts();
      }
    }, 150);
    this.filters.name = this.search;
    this.filters.offset = 0;
  }

  getConcerts() {
    this.concertService.find_concert_name(this.search).subscribe((data: any) => {
      this.concerts = data.concert;
    });
  }

  public search_event(data: any): void {
    if (typeof data.search_value === "string") {
      this.filters.name = data.search_value;
      this.filters.offset = 0;
      this.Router.navigate(["/shop/" + btoa(JSON.stringify(this.filters))]);
    }
  }
}
