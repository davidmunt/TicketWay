import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from '../shared/layout/header/header.component';
import { FooterComponent } from '../shared/layout/footer/footer.component';
// import { ProductService, UserService } from '../core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    HttpClientModule,
    NgbModule,
    CommonModule,
  ],
})
// export class MainComponent { }
export class MainComponent implements OnInit {
  // constructor(private userService: UserService) {}

  ngOnInit(): void {
    // this.userService.populate();
  }
}
