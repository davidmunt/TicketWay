import { Component, OnInit } from "@angular/core";
import { UserAdminService } from "../../../core/services";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-admin-payment-dashboard",
  templateUrl: "./admin-payment-dashboard.component.html",
  styleUrls: ["./admin-payment-dashboard.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminPaymentDashboardComponent implements OnInit {
  users = this.userAdminService.users;

  constructor(private userAdminService: UserAdminService) {}

  ngOnInit(): void {
    this.userAdminService.getAllPayments().subscribe();
  }
}
