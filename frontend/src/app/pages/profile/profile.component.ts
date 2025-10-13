import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink, RouterModule } from "@angular/router";
import { ProfileComponentComponent } from "../../shared/profile/profile.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [RouterModule, RouterLink, ProfileComponentComponent],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
