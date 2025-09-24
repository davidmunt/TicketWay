import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import { ShowAuthedDirective } from '../../show-authed.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    // Router
    CommonModule,
    RouterLink,
    // ShowAuthedDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  // currentUser: User;

  constructor(
    // private router: Router,
    // private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // // console.log(this.currentUser);
    // this.userService.currentUser.subscribe((userData) => {
    //   // console.log(userData);
    //   this.currentUser = userData;
    //   this.cd.markForCheck();
    // });
  }

  logout() {
    // this.userService.purgeAuth();
    // this.router.navigateByUrl('/');
  }
}
