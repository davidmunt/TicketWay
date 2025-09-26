import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Category } from "../../core/models";
import { CategoryService } from "../../core/services";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-card-category",
  templateUrl: "./card-category.component.html",
  styleUrls: ["./card-category.component.css"],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class CardCategoryComponent implements OnInit {
  @Input() category: Category = {} as Category;
  catLength: number;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.catLength = Object.keys(this.category).length;
  }
}
