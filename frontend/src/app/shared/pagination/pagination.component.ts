import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number[] = [];

  @Output() pageChange = new EventEmitter<number>();

  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages.length) {
      this.pageChange.emit(pageNumber);
    }
  }
}
