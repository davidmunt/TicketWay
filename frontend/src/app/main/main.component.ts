import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "../shared/layout/header/header.component";
import { FooterComponent } from "../shared/layout/footer/footer.component";
// import { ProductService, UserService } from '../core';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, HttpClientModule, CommonModule],
})
// export class MainComponent { }
export class MainComponent implements OnInit {
  // constructor(private userService: UserService) {}

  ngOnInit(): void {
    // this.userService.populate();
  }
}
